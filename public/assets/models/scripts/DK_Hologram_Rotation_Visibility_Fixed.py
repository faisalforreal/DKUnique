import bpy
import math
import random
from mathutils import Vector

# ==============================================================================
# DK UNIQUE PRODUCTION — POLISHED HOLOGRAM GENERATOR
# Blender 3.6 / 4.x / 5.x
# ==============================================================================
# QUICK START
# 1. Open Blender > Scripting > New, paste this script, then Run Script.
# 2. Change ACTIVE_PRESET below and run again to try another color combination.
# 3. The script frames the camera and enables scene-lit Material Preview.
# 4. Press Space to play the seamless 240-frame animation. F12 renders a still.
#
# WARNING: CLEAR_SCENE = True replaces the objects in the current scene.
# ==============================================================================

ACTIVE_PRESET = "03_VIOLET_BLUE_CYAN"
CLEAR_SCENE = True
RENDER_ENGINE = "EEVEE"          # "EEVEE" or "CYCLES"
ADD_PARTICLES = True
ADD_BASE_TICKS = True
RESOLUTION = 1080
FRAME_END = 240
FPS = 60

PRESETS = {
    "01_CYAN_MAGENTA": {
        "label": "Neon Cyan + Magenta",
        "primary": "#00E5FF",
        "secondary": "#B7F6FF",
        "accent": "#FF2BD6",
        "background": "#0A0F24",
        "gradient": None,
    },
    "02_ICE_ELECTRIC_BLUE": {
        "label": "Ice White + Electric Blue",
        "primary": "#EAF7FF",
        "secondary": "#A9D8FF",
        "accent": "#3DA5FF",
        "background": "#050B18",
        "gradient": None,
    },
    "03_VIOLET_BLUE_CYAN": {
        "label": "Violet / Blue / Cyan Gradient",
        "primary": "#7C3AED",
        "secondary": "#67E8F9",
        "accent": "#22D3EE",
        "background": "#080616",
        "gradient": ["#7C3AED", "#3B82F6", "#22D3EE"],
    },
    "04_AMBER_INDIGO": {
        "label": "Warm Amber + Indigo",
        "primary": "#FFB84D",
        "secondary": "#FFE0A3",
        "accent": "#FF6B35",
        "background": "#0B0B1A",
        "gradient": None,
    },
    "05_MINT_WHITE": {
        "label": "Mint + Ice White",
        "primary": "#5CFFD9",
        "secondary": "#B8FFF0",
        "accent": "#E8FFFA",
        "background": "#04110F",
        "gradient": None,
    },
}

if ACTIVE_PRESET not in PRESETS:
    raise ValueError("Unknown ACTIVE_PRESET. Choose: " + ", ".join(PRESETS.keys()))
P = PRESETS[ACTIVE_PRESET]
LOOP_END = FRAME_END + 1


# ------------------------------------------------------------------------------
# GENERAL HELPERS
# ------------------------------------------------------------------------------
def hex_rgba(value):
    """Convert an sRGB hex color to Blender scene-linear RGBA."""
    value = value.lstrip("#")
    rgb = [int(value[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]

    def linear(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return (*[linear(c) for c in rgb], 1.0)


def rgba_luminance(color, multiplier):
    return (color[0] * multiplier, color[1] * multiplier,
            color[2] * multiplier, color[3])


def set_input(node, socket_name, value):
    socket = node.inputs.get(socket_name)
    if socket is not None:
        socket.default_value = value


def set_material_transparency(mat):
    """Two-sided transparency that remains visible while objects rotate.

    BLENDED/BLEND with transparency overlap disabled can drop back-facing and
    overlapping surfaces in EEVEE. DITHERED/HASHED preserves the full mesh.
    """
    if hasattr(mat, "surface_render_method"):
        try:
            mat.surface_render_method = 'DITHERED'
        except (TypeError, ValueError):
            pass
    if hasattr(mat, "blend_method"):
        try:
            mat.blend_method = 'HASHED'
        except (TypeError, ValueError):
            pass
    if hasattr(mat, "use_transparency_overlap"):
        mat.use_transparency_overlap = True
    if hasattr(mat, "use_backface_culling"):
        mat.use_backface_culling = False
    if hasattr(mat, "use_backface_culling_shadow"):
        mat.use_backface_culling_shadow = False
    if hasattr(mat, "use_backface_culling_lightprobe_volume"):
        mat.use_backface_culling_lightprobe_volume = False
    if hasattr(mat, "show_transparent_back"):
        mat.show_transparent_back = True


def action_fcurves(obj):
    """Yield F-curves from both legacy and layered Blender Actions."""
    if not obj.animation_data or not obj.animation_data.action:
        return
    action = obj.animation_data.action
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    if hasattr(action, "layers"):
        for layer in action.layers:
            for strip in layer.strips:
                if hasattr(strip, "channelbags"):
                    for bag in strip.channelbags:
                        yield from bag.fcurves


def linear_keys(obj):
    for fcurve in action_fcurves(obj):
        for key in fcurve.keyframe_points:
            key.interpolation = 'LINEAR'


def bezier_keys(obj):
    for fcurve in action_fcurves(obj):
        for key in fcurve.keyframe_points:
            key.interpolation = 'BEZIER'
            key.handle_left_type = 'AUTO_CLAMPED'
            key.handle_right_type = 'AUTO_CLAMPED'


def move_to_collection(obj, collection):
    for old_collection in list(obj.users_collection):
        old_collection.objects.unlink(obj)
    collection.objects.link(obj)


def smooth(obj):
    if obj.type == 'MESH':
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def point_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


# ------------------------------------------------------------------------------
# CLEAN SCENE AND CREATE COLLECTIONS
# ------------------------------------------------------------------------------
if CLEAR_SCENE:
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.materials, bpy.data.curves):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    def remove_generated_collection(collection):
        for child in list(collection.children):
            remove_generated_collection(child)
        bpy.data.collections.remove(collection)

    for collection in list(bpy.data.collections):
        if collection.name.startswith("DK_HOLOGRAM_STUDIO"):
            remove_generated_collection(collection)

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = FRAME_END
scene.render.fps = FPS
scene.name = "DK Hologram — " + P["label"]

root_collection = bpy.data.collections.new("DK_HOLOGRAM_STUDIO")
scene.collection.children.link(root_collection)


def new_collection(name):
    collection = bpy.data.collections.new(name)
    root_collection.children.link(collection)
    return collection


logo_collection = new_collection("01 • Logo")
ring_collection = new_collection("02 • Gyro rings")
projector_collection = new_collection("03 • Projector")
fx_collection = new_collection("04 • Atmosphere")
studio_collection = new_collection("05 • Camera & lighting")


# ------------------------------------------------------------------------------
# RENDER, WORLD, AND COLOR MANAGEMENT
# ------------------------------------------------------------------------------
if RENDER_ENGINE.upper() == "CYCLES":
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
else:
    for engine_name in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            scene.render.engine = engine_name
            break
        except (TypeError, ValueError):
            continue
    if hasattr(scene, "eevee") and hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 64

scene.render.resolution_x = RESOLUTION
scene.render.resolution_y = RESOLUTION
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'

# Standard preserves saturated neon hues; AgX tends to wash bright emission to white.
try:
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
except (TypeError, ValueError):
    pass
scene.view_settings.exposure = -0.65

world = scene.world or bpy.data.worlds.new("DK_Hologram_World")
scene.world = world
world.use_nodes = True
world_nodes = world.node_tree.nodes
world_nodes.clear()
world_output = world_nodes.new('ShaderNodeOutputWorld')
world_background = world_nodes.new('ShaderNodeBackground')
world_background.inputs['Color'].default_value = (0.0, 0.0, 0.0, 1.0)
world_background.inputs['Strength'].default_value = 0.0
world.node_tree.links.new(world_background.outputs['Background'], world_output.inputs['Surface'])


# ------------------------------------------------------------------------------
# MODERN HOLOGRAM SHADERS
# ------------------------------------------------------------------------------
def fresh_material(name, viewport_color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = viewport_color
    mat.node_tree.nodes.clear()
    return mat, mat.node_tree.nodes, mat.node_tree.links


def add_gradient(nodes, links, source, colors):
    separate = nodes.new('ShaderNodeSeparateXYZ')
    separate.location = (-720, 260)
    links.new(source, separate.inputs[0])

    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.location = (-500, 260)
    ramp.color_ramp.interpolation = 'EASE'
    elements = ramp.color_ramp.elements
    elements.remove(elements[1])
    for index, color in enumerate(colors):
        position = index / max(1, len(colors) - 1)
        element = elements[0] if index == 0 else elements.new(position)
        element.position = position
        element.color = hex_rgba(color)
    # Converted text still has its original local XY plane: local Y is vertical.
    links.new(separate.outputs['Y'], ramp.inputs['Fac'])
    return ramp.outputs['Color']


def make_hologram_material(name, color, strength=5.0, opacity=0.86,
                           scanlines=85.0, gradient=None, pulse=False):
    mat, nodes, links = fresh_material(name, hex_rgba(color))
    set_material_transparency(mat)

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (760, 80)
    mix = nodes.new('ShaderNodeMixShader')
    mix.location = (520, 80)
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    transparent.location = (280, -30)
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (280, 150)
    emission.inputs['Color'].default_value = hex_rgba(color)
    emission.inputs['Strength'].default_value = strength
    links.new(transparent.outputs[0], mix.inputs[1])
    links.new(emission.outputs[0], mix.inputs[2])
    links.new(mix.outputs[0], output.inputs['Surface'])

    coordinates = nodes.new('ShaderNodeTexCoord')
    coordinates.location = (-940, 60)
    if gradient:
        gradient_color = add_gradient(nodes, links, coordinates.outputs['Generated'], gradient)
        links.new(gradient_color, emission.inputs['Color'])

    wave = nodes.new('ShaderNodeTexWave')
    wave.location = (-700, -150)
    wave.wave_type = 'BANDS'
    wave.bands_direction = 'Z'
    wave.wave_profile = 'SIN'
    wave.inputs['Scale'].default_value = scanlines
    wave.inputs['Distortion'].default_value = 0.0
    links.new(coordinates.outputs['Generated'], wave.inputs['Vector'])
    wave.inputs['Phase Offset'].default_value = 0.0
    wave.inputs['Phase Offset'].keyframe_insert('default_value', frame=1)
    wave.inputs['Phase Offset'].default_value = math.tau * 6.0
    wave.inputs['Phase Offset'].keyframe_insert('default_value', frame=LOOP_END)
    linear_keys(mat.node_tree)

    scan_map = nodes.new('ShaderNodeMapRange')
    scan_map.location = (-430, -140)
    scan_map.inputs['To Min'].default_value = 0.58
    scan_map.inputs['To Max'].default_value = 1.0
    links.new(wave.outputs['Fac'], scan_map.inputs['Value'])

    opacity_math = nodes.new('ShaderNodeMath')
    opacity_math.operation = 'MULTIPLY'
    opacity_math.location = (-170, -120)
    opacity_math.inputs[1].default_value = opacity
    links.new(scan_map.outputs['Result'], opacity_math.inputs[0])

    fresnel = nodes.new('ShaderNodeFresnel')
    fresnel.location = (-420, 80)
    fresnel.inputs['IOR'].default_value = 1.22
    rim_math = nodes.new('ShaderNodeMath')
    rim_math.operation = 'MULTIPLY'
    rim_math.location = (-170, 100)
    rim_math.inputs[1].default_value = 0.20
    links.new(fresnel.outputs['Fac'], rim_math.inputs[0])

    add = nodes.new('ShaderNodeMath')
    add.operation = 'ADD'
    add.use_clamp = True
    add.location = (70, -20)
    links.new(opacity_math.outputs[0], add.inputs[0])
    links.new(rim_math.outputs[0], add.inputs[1])
    links.new(add.outputs[0], mix.inputs[0])

    strength_map = nodes.new('ShaderNodeMapRange')
    strength_map.location = (-150, -340)
    strength_map.inputs['To Min'].default_value = strength * 0.78
    strength_map.inputs['To Max'].default_value = strength
    links.new(wave.outputs['Fac'], strength_map.inputs['Value'])
    links.new(strength_map.outputs['Result'], emission.inputs['Strength'])

    if pulse:
        driver = emission.inputs['Strength'].driver_add('default_value').driver
        driver.expression = f"{strength} + 0.22*sin(2*pi*(frame-1)/{FRAME_END})"
        # The pulse overrides scanline strength modulation, keeping it subtle.
        for link in list(emission.inputs['Strength'].links):
            links.remove(link)

    return mat


def make_emission_material(name, color, strength=6.0, pulse=False):
    mat, nodes, links = fresh_material(name, hex_rgba(color))
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (260, 0)
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (0, 0)
    emission.inputs['Color'].default_value = hex_rgba(color)
    emission.inputs['Strength'].default_value = strength
    links.new(emission.outputs[0], output.inputs['Surface'])
    if pulse:
        driver = emission.inputs['Strength'].driver_add('default_value').driver
        driver.expression = f"{strength} + 0.3*sin(2*pi*(frame-1)/{FRAME_END})"
    return mat


def make_cone_material(name, color):
    """Open, almost-clear cone: bright Fresnel edges, soft scanlines, top fade."""
    mat, nodes, links = fresh_material(name, hex_rgba(color))
    set_material_transparency(mat)

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (930, 80)
    mix = nodes.new('ShaderNodeMixShader')
    mix.location = (700, 80)
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    transparent.location = (470, -20)
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (470, 170)
    emission.inputs['Color'].default_value = hex_rgba(color)
    emission.inputs['Strength'].default_value = 2.4
    links.new(transparent.outputs[0], mix.inputs[1])
    links.new(emission.outputs[0], mix.inputs[2])
    links.new(mix.outputs[0], output.inputs['Surface'])

    coordinates = nodes.new('ShaderNodeTexCoord')
    coordinates.location = (-1050, 80)
    fresnel = nodes.new('ShaderNodeFresnel')
    fresnel.location = (-800, 300)
    fresnel.inputs['IOR'].default_value = 1.12
    edge_power = nodes.new('ShaderNodeMath')
    edge_power.operation = 'POWER'
    edge_power.location = (-580, 300)
    edge_power.inputs[1].default_value = 1.4
    links.new(fresnel.outputs['Fac'], edge_power.inputs[0])

    separate = nodes.new('ShaderNodeSeparateXYZ')
    separate.location = (-810, 20)
    links.new(coordinates.outputs['Generated'], separate.inputs[0])
    fade = nodes.new('ShaderNodeValToRGB')
    fade.location = (-570, 30)
    fade.color_ramp.elements[0].position = 0.0
    fade.color_ramp.elements[0].color = (0.85, 0.85, 0.85, 1)
    fade.color_ramp.elements[1].position = 1.0
    fade.color_ramp.elements[1].color = (0.04, 0.04, 0.04, 1)
    middle = fade.color_ramp.elements.new(0.30)
    middle.color = (0.34, 0.34, 0.34, 1)
    links.new(separate.outputs['Z'], fade.inputs['Fac'])

    wave = nodes.new('ShaderNodeTexWave')
    wave.location = (-810, -270)
    wave.wave_type = 'BANDS'
    wave.bands_direction = 'Z'
    wave.inputs['Scale'].default_value = 32.0
    links.new(coordinates.outputs['Generated'], wave.inputs['Vector'])
    wave.inputs['Phase Offset'].default_value = 0.0
    wave.inputs['Phase Offset'].keyframe_insert('default_value', frame=1)
    wave.inputs['Phase Offset'].default_value = math.tau * 3.0
    wave.inputs['Phase Offset'].keyframe_insert('default_value', frame=LOOP_END)
    linear_keys(mat.node_tree)

    scan_map = nodes.new('ShaderNodeMapRange')
    scan_map.location = (-550, -250)
    scan_map.inputs['To Min'].default_value = 0.42
    scan_map.inputs['To Max'].default_value = 0.90
    links.new(wave.outputs['Fac'], scan_map.inputs['Value'])

    edge_fade = nodes.new('ShaderNodeMath')
    edge_fade.operation = 'MULTIPLY'
    edge_fade.location = (-280, 240)
    links.new(edge_power.outputs[0], edge_fade.inputs[0])
    links.new(fade.outputs['Color'], edge_fade.inputs[1])
    scan_multiply = nodes.new('ShaderNodeMath')
    scan_multiply.operation = 'MULTIPLY'
    scan_multiply.location = (-60, 160)
    links.new(edge_fade.outputs[0], scan_multiply.inputs[0])
    links.new(scan_map.outputs['Result'], scan_multiply.inputs[1])

    opacity = nodes.new('ShaderNodeMath')
    opacity.operation = 'MULTIPLY_ADD'
    opacity.use_clamp = True
    opacity.location = (200, 70)
    opacity.inputs[1].default_value = 0.22
    opacity.inputs[2].default_value = 0.004
    links.new(scan_multiply.outputs[0], opacity.inputs[0])

    # OCCLUSION FIX: render only the cone's far/rear wall. The near wall is
    # fully transparent, so it cannot cover the rotating logo from any side.
    # This is shader-based and therefore works in both EEVEE and Cycles.
    geometry = nodes.new('ShaderNodeNewGeometry')
    geometry.location = (170, -210)
    rear_wall_only = nodes.new('ShaderNodeMath')
    rear_wall_only.operation = 'MULTIPLY'
    rear_wall_only.location = (450, 50)
    links.new(opacity.outputs[0], rear_wall_only.inputs[0])
    links.new(geometry.outputs['Backfacing'], rear_wall_only.inputs[1])
    links.new(rear_wall_only.outputs[0], mix.inputs[0])
    return mat


def make_metal_material(name, color, metallic=0.85, roughness=0.24):
    mat, nodes, links = fresh_material(name, hex_rgba(color))
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = hex_rgba(color)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    links.new(bsdf.outputs[0], output.inputs['Surface'])
    return mat


mat_dk = make_hologram_material(
    "Holo • DK gradient / primary", P["primary"], strength=5.2,
    opacity=0.92, scanlines=72.0, gradient=P["gradient"])
mat_unique = make_hologram_material(
    "Holo • UNIQUE secondary", P["secondary"], strength=4.5,
    opacity=0.88, scanlines=92.0)
mat_production = make_hologram_material(
    "Holo • PRODUCTION primary dim", P["primary"], strength=3.8,
    opacity=0.82, scanlines=105.0)
mat_ring_primary = make_emission_material(
    "Holo • Primary rings", P["primary"], strength=7.0, pulse=True)
mat_ring_accent = make_emission_material(
    "Holo • Accent rings", P["accent"], strength=6.4, pulse=True)
mat_soft_primary = make_hologram_material(
    "Holo • Soft primary", P["primary"], strength=2.8,
    opacity=0.22, scanlines=45.0)
mat_cone = make_cone_material("Holo • Fresnel projection cone", P["primary"])
mat_pedestal = make_metal_material("Projector • Graphite metal", "#111827", 0.88, 0.22)
mat_top = make_metal_material("Projector • Dark glass", "#07101D", 0.62, 0.16)
mat_floor = make_metal_material("Studio • Midnight floor", P["background"], 0.28, 0.30)
mat_ticks = make_emission_material("Projector • Dim ticks", P["primary"], 1.8)
mat_ticks_accent = make_emission_material("Projector • Accent ticks", P["accent"], 2.6)


# ------------------------------------------------------------------------------
# CONTROLLER RIG
# ------------------------------------------------------------------------------
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 1.4))
hover_root = bpy.context.object
hover_root.name = "DK • Hover controller"
hover_root.empty_display_size = 0.35
move_to_collection(hover_root, fx_collection)

bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 1.4))
spin_rig = bpy.context.object
spin_rig.name = "DK • Turntable controller"
spin_rig.empty_display_size = 0.25
spin_rig.parent = hover_root
spin_rig.matrix_parent_inverse = hover_root.matrix_world.inverted()
move_to_collection(spin_rig, fx_collection)


def parent_keep_transform(obj, parent):
    world_matrix = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_world = world_matrix


# ------------------------------------------------------------------------------
# LOGO — ORIGINAL DESIGN, CLEANER EMISSIVE FINISH
# ------------------------------------------------------------------------------
def create_3d_text(name, body, size, extrude, bevel, z, material):
    bpy.ops.object.text_add(location=(0, 0, z))
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = (math.radians(90), 0, 0)
    curve = obj.data
    curve.body = body
    curve.align_x = 'CENTER'
    curve.align_y = 'CENTER'
    curve.size = size
    curve.extrude = extrude
    curve.bevel_depth = bevel
    curve.bevel_resolution = 4
    curve.space_character = 1.12
    bpy.ops.object.convert(target='MESH')
    obj = bpy.context.object
    smooth(obj)
    obj.data.materials.append(material)
    parent_keep_transform(obj, spin_rig)
    move_to_collection(obj, logo_collection)
    return obj


create_3d_text("Text • DK", "DK", 1.35, 0.12, 0.020, 1.85, mat_dk)
create_3d_text("Text • UNIQUE", "UNIQUE", 0.58, 0.075, 0.012, 1.05, mat_unique)
create_3d_text("Text • PRODUCTION", "PRODUCTION", 0.34, 0.045, 0.008, 0.58, mat_production)


# ------------------------------------------------------------------------------
# GYRO RINGS AND WIREFRAME CORE
# ------------------------------------------------------------------------------
def torus(name, major, minor, location, material, collection,
          rotation=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major, minor_radius=minor,
        major_segments=128, minor_segments=12,
        location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    smooth(obj)
    obj.data.materials.append(material)
    if parent:
        parent_keep_transform(obj, parent)
    move_to_collection(obj, collection)
    return obj


outer_ring = torus(
    "Gyro • Outer primary", 2.25, 0.018, (0, 0, 1.35), mat_ring_primary,
    ring_collection, (math.radians(18), math.radians(-12), 0), hover_root)
inner_ring = torus(
    "Gyro • Inner accent", 1.92, 0.013, (0, 0, 1.35), mat_ring_accent,
    ring_collection, (math.radians(-24), math.radians(20), 0), hover_root)

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.95, location=(0, 0.24, 1.35))
wire_core = bpy.context.object
wire_core.name = "Holo • Wireframe energy core"
wire = wire_core.modifiers.new("Fine wireframe", 'WIREFRAME')
wire.thickness = 0.009
wire_core.data.materials.append(mat_soft_primary)
parent_keep_transform(wire_core, spin_rig)
move_to_collection(wire_core, ring_collection)

for ring, radius, material, name in (
        (outer_ring, 2.25, mat_ring_accent, "Gyro • Outer satellite"),
        (inner_ring, 1.92, mat_ring_primary, "Gyro • Inner satellite")):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, radius=0.045)
    satellite = bpy.context.object
    satellite.name = name
    satellite.parent = ring
    satellite.location = (radius, 0, 0)
    satellite.data.materials.append(material)
    smooth(satellite)
    move_to_collection(satellite, ring_collection)


# ------------------------------------------------------------------------------
# PROJECTOR BASE — BEVELS, GLASS, EMITTER, RADIAL TICKS
# ------------------------------------------------------------------------------
def cylinder(name, radius, depth, z, material, bevel_width=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=radius, depth=depth,
                                      location=(0, 0, z))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    if bevel_width:
        bevel = obj.modifiers.new("Soft machined edges", 'BEVEL')
        bevel.width = bevel_width
        bevel.segments = 3
        normal = obj.modifiers.new("Weighted corner normals", 'WEIGHTED_NORMAL')
        normal.keep_sharp = True
    smooth(obj)
    move_to_collection(obj, projector_collection)
    return obj


# Pure floating hologram: solid pedestal base and floor removed so light floats suspended in empty space
# cylinder("Projector • Beveled graphite base", 1.48, 0.22, -0.38, mat_pedestal, 0.055)
# cylinder("Projector • Dark glass top", 1.29, 0.035, -0.252, mat_top, 0.015)
# cylinder("Projector • Center lens", 0.46, 0.025, -0.224, mat_top, 0.010)
torus("Projector • Main emitter", 1.25, 0.026, (0, 0, -0.222),
      mat_ring_primary, projector_collection)
torus("Projector • Inner emitter", 0.88, 0.010, (0, 0, -0.217),
      mat_ring_accent, projector_collection)

# if ADD_BASE_TICKS:
#     for index in range(36):
#         angle = math.tau * index / 36.0
#         radius = 1.365
#         bpy.ops.mesh.primitive_cube_add(size=1, location=(
#             radius * math.cos(angle), radius * math.sin(angle), -0.245))
#         tick = bpy.context.object
#         tick.name = f"Projector • Radial tick {index + 1:02d}"
#         tick.dimensions = (0.022, 0.075 if index % 3 else 0.115, 0.012)
#         tick.rotation_euler.z = angle
#         bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
#         tick.data.materials.append(mat_ticks_accent if index % 3 == 0 else mat_ticks)
#         move_to_collection(tick, projector_collection)

# Open cone: no solid cap, so the middle stays genuinely transparent.
bpy.ops.mesh.primitive_cone_add(
    vertices=128, radius1=1.22, radius2=2.35, depth=2.5,
    end_fill_type='NOTHING', location=(0, 0, 1.0))
proj_cone = bpy.context.object
proj_cone.name = "Projector • Open Fresnel light cone"
smooth(proj_cone)
proj_cone.data.materials.append(mat_cone)
if hasattr(proj_cone, 'visible_shadow'):
    proj_cone.visible_shadow = False
move_to_collection(proj_cone, projector_collection)
torus("Projector • Faint top rim", 2.35, 0.005, (0, 0, 2.25),
      mat_soft_primary, projector_collection)


# ------------------------------------------------------------------------------
# SPARSE, SEAMLESSLY LOOPING PARTICLES INSIDE THE BEAM
# ------------------------------------------------------------------------------
if ADD_PARTICLES:
    rng = random.Random(240)
    for index in range(22):
        angle = rng.uniform(0, math.tau)
        radius = rng.uniform(0.18, 1.02)
        phase = rng.random()
        size = rng.uniform(0.008, 0.021)
        bpy.ops.mesh.primitive_ico_sphere_add(
            subdivisions=1, radius=size,
            location=(radius * math.cos(angle), radius * math.sin(angle), 0))
        particle = bpy.context.object
        particle.name = f"Beam • Rising mote {index + 1:02d}"
        particle.data.materials.append(mat_ticks_accent if index % 5 == 0 else mat_ticks)
        driver = particle.driver_add('location', 2).driver
        driver.expression = f"-0.18 + ((frame/{FRAME_END} + {phase:.6f}) % 1.0) * 2.30"
        move_to_collection(particle, fx_collection)


# ------------------------------------------------------------------------------
# SEAMLESS ANIMATION — ROTATION, HOVER, COUNTER-ROTATING RINGS
# ------------------------------------------------------------------------------
spin_rig.rotation_euler = (0, 0, 0)
spin_rig.keyframe_insert(data_path='rotation_euler', frame=1)
spin_rig.rotation_euler = (0, 0, math.tau)
spin_rig.keyframe_insert(data_path='rotation_euler', frame=LOOP_END)
linear_keys(spin_rig)

for frame, z_value in ((1, 1.40), (61, 1.56), (121, 1.40),
                       (181, 1.24), (LOOP_END, 1.40)):
    hover_root.location.z = z_value
    hover_root.keyframe_insert(data_path='location', index=2, frame=frame)
bezier_keys(hover_root)

outer_ring.rotation_euler = (math.radians(18), math.radians(-12), 0)
outer_ring.keyframe_insert(data_path='rotation_euler', frame=1)
outer_ring.rotation_euler = (math.radians(18), math.radians(-12), -math.tau)
outer_ring.keyframe_insert(data_path='rotation_euler', frame=LOOP_END)
linear_keys(outer_ring)

inner_ring.rotation_euler = (math.radians(-24), math.radians(20), 0)
inner_ring.keyframe_insert(data_path='rotation_euler', frame=1)
inner_ring.rotation_euler = (math.radians(-24), math.radians(20), math.tau * 2)
inner_ring.keyframe_insert(data_path='rotation_euler', frame=LOOP_END)
linear_keys(inner_ring)


# ------------------------------------------------------------------------------
# STUDIO LIGHTING AND CAMERA (Ground floor plane removed for pure floating hologram)
# ------------------------------------------------------------------------------
# bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -0.505))
# floor = bpy.context.object
# floor.name = "Studio • Infinite dark floor"
# floor.data.materials.append(mat_floor)
# move_to_collection(floor, studio_collection)


def light(name, light_type, location, color, energy, size, target=None):
    data = bpy.data.lights.new(name, light_type)
    data.color = hex_rgba(color)[:3]
    data.energy = energy
    if light_type == 'AREA':
        data.shape = 'DISK'
        data.size = size
    elif light_type == 'POINT':
        data.shadow_soft_size = size
    obj = bpy.data.objects.new(name, data)
    studio_collection.objects.link(obj)
    obj.location = location
    if target is not None:
        point_at(obj, target)
    return obj


light("Studio • Soft key", 'AREA', (0, -4.0, 5.0), P["secondary"], 420, 4.0,
      (0, 0, 0.8))
light("Studio • Accent rim", 'AREA', (3.5, 1.5, 3.0), P["accent"], 300, 3.0,
      (0, 0, 1.0))
light("Studio • Primary rim", 'AREA', (-3.0, 1.0, 2.0), P["primary"], 240, 2.5,
      (0, 0, 0.8))
light("Projector • Emitter bounce", 'POINT', (0, 0, -0.02), P["primary"], 55, 0.8)

camera_data = bpy.data.cameras.new("DK • Showcase camera")
camera = bpy.data.objects.new("DK • Showcase camera", camera_data)
studio_collection.objects.link(camera)
camera.location = (0, -6.6, 1.65)
point_at(camera, (0, 0, 1.35))
camera_data.lens = 42
camera_data.sensor_width = 36
camera_data.clip_start = 0.05
camera_data.clip_end = 250
scene.camera = camera


# ------------------------------------------------------------------------------
# COMPOSITOR GLOW — SUPPORTS LEGACY AND BLENDER 5 COMPOSITOR WORKFLOWS
# ------------------------------------------------------------------------------
def setup_glow_compositor(scene):
    if hasattr(scene, "compositing_node_group"):
        tree = bpy.data.node_groups.new("DK • Modern fog glow", 'CompositorNodeTree')
        tree.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
        scene.compositing_node_group = tree
        output = tree.nodes.new('NodeGroupOutput')
    else:
        scene.use_nodes = True
        tree = scene.node_tree
        tree.nodes.clear()
        output = tree.nodes.new('CompositorNodeComposite')

    nodes, links = tree.nodes, tree.links
    render_layers = nodes.new('CompositorNodeRLayers')
    render_layers.location = (-320, 40)
    glare = nodes.new('CompositorNodeGlare')
    glare.location = (-60, 40)
    output.location = (220, 40)

    if glare.inputs.get('Type') is not None:
        glare.inputs['Type'].default_value = 'Fog Glow'
        glare.inputs['Quality'].default_value = 'High'
        glare.inputs['Threshold'].default_value = 1.15
        glare.inputs['Strength'].default_value = 0.42
        glare.inputs['Size'].default_value = 0.34
    else:
        glare.glare_type = 'FOG_GLOW'
        glare.quality = 'HIGH'
        glare.threshold = 1.15
        glare.size = 8
        glare.mix = 0.0

    links.new(render_layers.outputs['Image'], glare.inputs['Image'])
    links.new(glare.outputs['Image'], output.inputs['Image'])


setup_glow_compositor(scene)


# ------------------------------------------------------------------------------
# CLEAN STARTUP VIEW
# ------------------------------------------------------------------------------
scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = None
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            space = area.spaces.active
            space.overlay.show_overlays = False
            space.region_3d.view_perspective = 'CAMERA'
            space.shading.type = 'MATERIAL'
            space.shading.use_scene_world = True
            space.shading.use_scene_lights = True
            if hasattr(space.shading, 'use_compositor'):
                space.shading.use_compositor = 'CAMERA'

print("=" * 78)
print("DK HOLOGRAM READY —", P["label"])
print("Active preset:", ACTIVE_PRESET)
print("To try another look, change ACTIVE_PRESET at the top and run again:")
for key, preset in PRESETS.items():
    print(" ", key, "—", preset["label"])
print("Space: play animation | Numpad 0: camera | F12: render")
print("=" * 78)
