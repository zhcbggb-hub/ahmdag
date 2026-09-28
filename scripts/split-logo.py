"""Splits public/logo.png into layers for the logo build animation (public/logo-parts/*.png).

Every layer keeps the full logo canvas, so stacking them gives back the original logo exactly.
Requires numpy, pillow and scipy.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

src = np.array(Image.open("public/logo.png").convert("RGBA"))
h, w = src.shape[:2]
alpha = src[:, :, 3]
solid = alpha > 40
lab, n = ndimage.label(solid)

# Faint edge and shadow pixels belong to the nearest solid piece.
_, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
near = lab[iy, ix]
near[alpha == 0] = 0

# Name each solid piece by where it sits in the logo.
groups = {"wings": set(), "souq": set(), "teal": set(), "jarablus": set(), "jeem": set(), "ribbon": set()}
for label, (ys, xs) in enumerate(ndimage.find_objects(lab), start=1):
    y0, x0, x1 = ys.start, xs.start, xs.stop
    if y0 > 600:
        groups["ribbon"].add(label)          # the tagline ribbon and its two dashes
    elif y0 < 90 and x1 - x0 < 80:
        groups["souq"].add(label)            # the two dots of ق
    elif x1 <= 520:
        groups["wings"].add(label)
    elif y0 < 100 and x0 > 700:
        groups["teal"].add(label)            # "سو" joined to the alef of جرابلس
    elif y0 < 100:
        groups["souq"].add(label)            # ق
    elif x0 > 700:
        groups["jeem"].add(label)            # ج and ر, with the pin
    else:
        groups["jarablus"].add(label)        # بلس and the dot of ب

yy, xx = np.mgrid[0:h, 0:w]
inside = lambda group: np.isin(near, list(group))

# The pin: a teardrop around its head, pointing down to the tip.
cx, cy, r, tip_y = 879, 372, 74, 510
t = np.clip((yy - cy) / (tip_y - cy), 0, 1)
pin_shape = ((xx - cx) ** 2 + (yy - cy) ** 2 <= r**2) | ((yy >= cy) & (yy <= tip_y) & (np.abs(xx - cx) <= (1 - t) * 64))
SPLIT_Y = 258  # where the waw's tail meets the alef

layers = {
    "wings": inside(groups["wings"]),
    "souq": inside(groups["souq"]) | (inside(groups["teal"]) & (yy < SPLIT_Y)),
    "jarablus": inside(groups["jarablus"]) | (inside(groups["teal"]) & (yy >= SPLIT_Y)) | (inside(groups["jeem"]) & ~pin_shape),
    "pin": inside(groups["jeem"]) & pin_shape,
    "ribbon": inside(groups["ribbon"]),
}

total = np.zeros((h, w), dtype=int)
canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
for name, mask in layers.items():
    mask &= alpha > 0
    out = src.copy()
    out[:, :, 3] = np.where(mask, alpha, 0)
    out[:, :, :3] = np.where(mask[..., None], out[:, :, :3], 0)  # clear hidden colour so the PNG stays small
    layer = Image.fromarray(out)
    layer.save(f"public/logo-parts/{name}.png", optimize=True)
    canvas.alpha_composite(layer)
    total += mask
    ys, xs = np.nonzero(mask)
    print(f"{name:9s} bbox x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}")

print("unassigned visible pixels:", int(((alpha > 0) & (total == 0)).sum()), "| double-assigned:", int((total > 1).sum()))
visible = alpha > 0
print("max difference vs original (visible pixels):", int(np.abs(np.array(canvas).astype(int) - src.astype(int))[visible].max()))
