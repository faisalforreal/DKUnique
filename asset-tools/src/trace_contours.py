"""Trace the gold monogram silhouette from the reference PNG into polygon contours.

v2: low threshold (gold shading stays inside the mask, only pure-black
background is excluded) + binary erosion to strip the glow fringe + hole
validation by mean source luminance (true counters are pure black; dark
shading inside strokes is not a cutout).
"""
import json
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use("Agg")
from matplotlib import pyplot as plt
from matplotlib.path import Path as MplPath

SRC = r"C:\Users\mdfai\Documents\SideProjects\DkUnique\assets\dk-reference.png"
OUT = r"C:\Users\mdfai\Documents\SideProjects\DkUnique\asset-tools\src\emblem_contours.json"
DBG = r"C:\Users\mdfai\Documents\SideProjects\DkUnique\asset-tools\src\trace_debug.png"

THRESH = 0.10
ERODE_PX = 2
HOLE_MAX_LUMA = 0.045  # mean luminance inside a hole must be below this (true black counter)

img = Image.open(SRC).convert("L")
a = np.asarray(img, dtype=np.float64) / 255.0
h, w = a.shape

mask = (a > THRESH).astype(np.float64)

# Erode (4-neighbour) to strip the anti-aliased glow fringe
for _ in range(ERODE_PX):
    m = mask.copy()
    m[1:, :] = np.minimum(m[1:, :], mask[:-1, :])
    m[:-1, :] = np.minimum(m[:-1, :], mask[1:, :])
    m[:, 1:] = np.minimum(m[:, 1:], mask[:, :-1])
    m[:, :-1] = np.minimum(m[:, :-1], mask[:, 1:])
    mask = m

mask = np.pad(mask, 2)
lum = np.pad(a, 2)

fig = plt.figure()
ax = fig.add_axes([0, 0, 1, 1])
cs = ax.contour(mask, levels=[0.5])
plt.close(fig)

polys = []
for path in cs.get_paths():
    for v in path.to_polygons():
        if len(v) >= 4:
            polys.append(v)


def signed_area(p):
    return 0.5 * np.sum(p[:-1, 0] * p[1:, 1] - p[1:, 0] * p[:-1, 1])


def point_in_poly(pt, poly):
    x, y = pt
    inside = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y):
            xint = (xj - xi) * (y - yi) / (yj - yi) + xi
            if x < xint:
                inside = not inside
        j = i
    return inside


polys = [p for p in polys if abs(signed_area(p)) > 50.0]
areas = [abs(signed_area(p)) for p in polys]
print("contours after speck filter:", len(polys))

# Containment depth on RAW polys
depths = []
for i, p in enumerate(polys):
    probe = p[0]
    d = 0
    for j, q in enumerate(polys):
        if i != j and areas[j] > areas[i] and point_in_poly(probe, q):
            d += 1
    depths.append(d)

outers = [p for p, d in zip(polys, depths) if d % 2 == 0]
outer_areas = [areas[i] for i, d in enumerate(depths) if d % 2 == 0]
holes_raw = [p for p, d in zip(polys, depths) if d % 2 == 1]
print("outers:", len(outers), "hole candidates:", len(holes_raw))


def mean_luma_inside(poly):
    """Mean source luminance inside the hole, via vectorized point-in-polygon."""
    mn = poly.min(axis=0).astype(int)
    mx = poly.max(axis=0).astype(int) + 1
    x0, x1 = max(mn[0], 0), min(mx[0], lum.shape[1])
    y0, y1 = max(mn[1], 0), min(mx[1], lum.shape[0])
    step = 2
    gx, gy = np.meshgrid(np.arange(x0, x1, step), np.arange(y0, y1, step))
    pts = np.column_stack([gx.ravel(), gy.ravel()])
    inside = MplPath(poly).contains_points(pts)
    vals = lum[y0:y1:step, x0:x1:step].ravel()[inside]
    return float(vals.mean()) if vals.size else 1.0


holes = []
for hp in holes_raw:
    ml = mean_luma_inside(hp)
    print(f"  hole cand: area={abs(signed_area(hp)):.0f} mean_luma={ml:.4f}", "KEEP" if ml < HOLE_MAX_LUMA else "fill")
    if ml < HOLE_MAX_LUMA:
        holes.append(hp)


def rdp(points, eps):
    keep = np.zeros(len(points), dtype=bool)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        i0, i1 = stack.pop()
        if i1 <= i0 + 1:
            continue
        p0, p1 = points[i0], points[i1]
        seg = p1 - p0
        seg_len = np.hypot(seg[0], seg[1])
        if seg_len < 1e-12:
            d = points[i0:i1 + 1] - p0
            dists = np.hypot(d[:, 0], d[:, 1])
        else:
            d = points[i0:i1 + 1] - p0
            dists = np.abs(seg[0] * d[:, 1] - seg[1] * d[:, 0]) / seg_len
        k = i0 + int(np.argmax(dists))
        if dists.max() > eps:
            keep[k] = True
            stack.append((i0, k))
            stack.append((k, i1))
    return points[keep]


def normalize(poly):
    p = poly.copy()
    p[:, 1] = (h + 4) - p[:, 1]
    p[:, 0] -= 2.0
    return p


outers_n = [normalize(rdp(p, 1.0)) for p in outers]
holes_n = [normalize(rdp(p, 1.0)) for p in holes]

allpts = np.vstack(outers_n + (holes_n if holes_n else outers_n))
mn, mx = allpts.min(axis=0), allpts.max(axis=0)
scale = 1.0 / (mx[1] - mn[1])
cx, cy = (mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2


def fin(p):
    q = (p - [cx, cy]) * scale
    return [[round(float(x), 5), round(float(y), 5)] for x, y in q]


shapes = [{"outer": fin(o), "holes": []} for o in outers_n]
# Attach holes using RAW pixel polys for containment (robust)
for hp_raw, hp_n in zip(holes, holes_n):
    probe = hp_raw[0]
    best, best_area = None, 1e18
    for idx, op in enumerate(outers):
        if outer_areas[idx] < best_area and point_in_poly(probe, op):
            best, best_area = idx, outer_areas[idx]
    if best is not None:
        shapes[best]["holes"].append(fin(hp_n))


def ensure_winding(pts, ccw=True):
    p = np.array(pts + [pts[0]])
    cc = signed_area(p) > 0
    return pts if cc == ccw else pts[::-1]


for s in shapes:
    s["outer"] = ensure_winding(s["outer"], True)
    s["holes"] = [ensure_winding(hh, False) for hh in s["holes"]]

out = {
    "source": "dk-reference.png",
    "shapes": shapes,
    "stats": {
        "outers": len(shapes),
        "holes": sum(len(s["holes"]) for s in shapes),
        "outer_pts": sum(len(s["outer"]) for s in shapes),
        "hole_pts": sum(len(hh) for s in shapes for hh in s["holes"]),
    },
}
with open(OUT, "w") as f:
    json.dump(out, f)
print(json.dumps(out["stats"]))

# Debug overlay: traced outlines over the source
fig, ax = plt.subplots(figsize=(8, 8))
ax.imshow(a, cmap="gray")
for s in shapes:
    for ring, color in [(s["outer"], "lime")] + [(hh, "red") for hh in s["holes"]]:
        p = np.array(ring) / scale + [cx, cy]
        p[:, 1] = (h + 4) - p[:, 1]
        p[:, 0] += 2.0
        p = np.vstack([p, p[:1]])
        ax.plot(p[:, 0] - 2, p[:, 1] - 2, color=color, lw=0.8)
ax.set_xlim(0, w)
ax.set_ylim(h, 0)
fig.savefig(DBG, dpi=110)
plt.close(fig)
print("debug:", DBG)
