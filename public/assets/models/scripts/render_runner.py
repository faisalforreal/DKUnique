import bpy
import os

# Load and execute the user's hologram script
script_path = r"c:\Users\mdfai\Documents\SideProjects\DkUnique\public\assets\models\scripts\DK_Hologram_Rotation_Visibility_Fixed.py"
with open(script_path, "r", encoding="utf-8") as f:
    code = f.read()
exec(compile(code, script_path, "exec"))

scene = bpy.context.scene
scene.render.resolution_x = 1080
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.fps = 60
scene.frame_start = 1
scene.frame_end = 240

# EEVEE samples for fast clean render
if hasattr(scene, "eevee") and hasattr(scene.eevee, "taa_render_samples"):
    scene.eevee.taa_render_samples = 8

output_dir = r"C:\tmp\dk_hologram_frames"
os.makedirs(output_dir, exist_ok=True)
scene.render.filepath = os.path.join(output_dir, "frame_")
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

print("Starting DK Hologram animation render (240 frames @ 60 FPS, 1080x1080)...")
bpy.ops.render.render(animation=True)
print("DK Hologram animation render finished successfully!")
