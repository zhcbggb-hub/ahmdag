"""Builds src/jarablus/origin/map-data.json, the real map of Jarablus District used by the origin story video.

Boundaries come from geoBoundaries (UN OCHA, CC BY 3.0 IGO): Syria, its governorates, the districts around
Jarablus, and Jarablus District's two sub-districts (Jarablus and Ghandorah). Villages, the Euphrates and the roads
come from OpenStreetMap (ODbL). Both are credited in the video.

Coordinates are projected to kilometres with Jarablus town at (0, 0), x to the east and y to the south, and
simplified so the file stays small.

    python3 scripts/build-jarablus-map.py            downloads into .cache/jarablus-map and writes the JSON
"""
import json
import math
import os
import urllib.parse
import urllib.request

CACHE = ".cache/jarablus-map"
OUT = "src/jarablus/origin/map-data.json"
GB = "https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbOpen/SYR/{0}/geoBoundaries-SYR-{0}{1}.geojson"
OVERPASS = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
BBOX = "36.45,37.55,36.90,38.20"

LON0, LAT0 = 38.010, 36.818  # Jarablus town
KX = 111.32 * math.cos(math.radians(LAT0))
KY = 110.57


def fetch(name, url, data=None):
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        body = urllib.parse.urlencode({"data": data}).encode() if data else None
        req = urllib.request.Request(url, data=body, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=300) as r, open(path, "wb") as f:
            f.write(r.read())
    with open(path) as f:
        return json.load(f)


def proj(lon, lat):
    return ((lon - LON0) * KX, (LAT0 - lat) * KY)


def simplify(points, tol):
    """Ramer-Douglas-Peucker, tolerance in kilometres."""
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-9
    best, index = 0.0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i]
        d = abs(dy * px - dx * py + x2 * y1 - y2 * x1) / norm if math.hypot(dx, dy) > 1e-9 else math.hypot(px - x1, py - y1)
        if d > best:
            best, index = d, i
    if best <= tol:
        return [points[0], points[-1]]
    return simplify(points[: index + 1], tol)[:-1] + simplify(points[index:], tol)


def path(rings, tol, closed=True):
    out = []
    for ring in rings:
        pts = simplify([proj(*c[:2]) for c in ring], tol)
        if len(pts) < 2:
            continue
        out.append("M" + "L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + ("Z" if closed else ""))
    return "".join(out)


def outer_rings(geometry):
    polys = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    return [p[0] for p in polys]


def inside(lon, lat, ring):
    c = False
    for i in range(len(ring)):
        x1, y1 = ring[i - 1][:2]
        x2, y2 = ring[i][:2]
        if (y1 > lat) != (y2 > lat) and lon < (x2 - x1) * (lat - y1) / (y2 - y1) + x1:
            c = not c
    return c


def main():
    adm0 = fetch("adm0.geojson", GB.format("ADM0", "_simplified"))
    adm1 = fetch("adm1.geojson", GB.format("ADM1", "_simplified"))
    adm2 = fetch("adm2.geojson", GB.format("ADM2", ""))
    adm3 = fetch("adm3.geojson", GB.format("ADM3", ""))
    osm = fetch(
        "osm.json",
        OVERPASS,
        f'[out:json][timeout:170];(node[place~"city|town|village"]({BBOX});way[waterway=river]({BBOX});'
        f'way[natural=water]({BBOX});way[highway~"^(trunk|primary|secondary|tertiary)$"]({BBOX}););out geom;',
    )

    district = next(f for f in adm2["features"] if f["properties"]["shapeName"] == "Jarablus")
    ring = outer_rings(district["geometry"])[0]
    subs = {f["properties"]["shapeName"]: f for f in adm3["features"] if f["properties"]["shapeName"] in ("Jarablus", "Ghandorah")}
    neighbours = [f for f in adm2["features"] if f["properties"]["shapeName"] in ("Al Bab", "Menbij", "Ain Al Arab", "A'zaz", "Azaz")]

    # Villages inside the district, with their Arabic names. Umm Rotha Fouqani is known locally as Al-Amarneh.
    villages = []
    for e in osm["elements"]:
        if e["type"] != "node" or e["tags"].get("place") not in ("town", "village") or not inside(e["lon"], e["lat"], ring):
            continue
        t = e["tags"]
        name = t.get("name:ar") or t.get("name")
        if t.get("name:en") == "Umm Rotha Fouqani":
            name = "العمارنة"
        x, y = proj(e["lon"], e["lat"])
        villages.append({"name": name, "x": round(x, 2), "y": round(y, 2), "pop": int(t.get("population", "0") or 0), "town": t.get("place") == "town"})

    near = lambda pts: any(-60 < x < 40 and -30 < y < 60 for x, y in pts)
    rivers, water, roads = [], [], []
    for e in osm["elements"]:
        if e["type"] != "way" or "geometry" not in e:
            continue
        pts = [proj(g["lon"], g["lat"]) for g in e["geometry"]]
        if not near(pts):
            continue
        t = e["tags"]
        d = "M" + "L".join(f"{x:.2f},{y:.2f}" for x, y in simplify(pts, 0.04))
        if t.get("waterway") == "river":
            rivers.append({"d": d, "euphrates": "الفرات" in (t.get("name", "") + t.get("name:ar", "")) or "Euphrates" in t.get("name:en", "")})
        elif t.get("natural") == "water":
            water.append(d + "Z")
        elif "highway" in t:
            roads.append({"d": d, "major": t["highway"] in ("trunk", "primary")})

    data = {
        "credit": "OpenStreetMap, UN OCHA",
        "syria": path(outer_rings(adm0["features"][0]["geometry"]), 1.5),
        "governorates": [path(outer_rings(f["geometry"]), 1.5) for f in adm1["features"]],
        "neighbours": [path(outer_rings(f["geometry"]), 0.15) for f in neighbours],
        "district": path([ring], 0.08),
        "subdistricts": {k: path(outer_rings(f["geometry"]), 0.08) for k, f in subs.items()},
        "rivers": rivers,
        "water": water,
        "roads": roads,
        "villages": sorted(villages, key=lambda v: -v["pop"]),
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Wrote {OUT}: {len(villages)} villages, {len(rivers)} rivers, {len(roads)} roads, {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    main()
