"""Builds the CandemFit room's map (v2) from OpenStreetMap: a real running loop around Moda, Kadıköy.

Fetches streets, coastline and parks from the Overpass API, routes a loop through the walkable
street graph between a few waypoints (shortest paths, footpaths preferred), and writes compact
SVG path data to src/components/v2/rooms/fit-map.json.  Map data © OpenStreetMap contributors (ODbL).

    python3 scripts/build-fit-map.py            # uses scripts/.cache/moda-osm.json if present
"""
import heapq, json, math, os, urllib.parse, urllib.request

BB = (40.9760, 29.0180, 40.9930, 29.0420)  # south, west, north, east
WAYPOINTS = [  # Kadıköy pier → Moda coast → Moda point → east coast → Moda Cd. → back
    (40.99057, 29.02297), (40.98596, 29.02074), (40.98159, 29.02090), (40.97976, 29.02521),
    (40.98057, 29.03096), (40.98499, 29.02984), (40.98911, 29.02681),
]
VIEW_W, VIEW_H, PAD = 530, 400, 26
HERE = os.path.dirname(__file__)
CACHE = os.path.join(HERE, ".cache", "moda-osm.json")
OUT = os.path.join(HERE, "..", "src", "components", "v2", "rooms", "fit-map.json")

def fetch():
    if os.path.exists(CACHE):
        return json.load(open(CACHE))
    s, w, n, e = BB
    q = (f'[out:json][timeout:60];(way["highway"]({s},{w},{n},{e});way["natural"="coastline"]({s - .006},{w - .008},{n + .007},{e + .008});'
         f'way["leisure"="park"]({s},{w},{n},{e}););out geom;')
    req = urllib.request.Request("https://overpass-api.de/api/interpreter", data=urllib.parse.urlencode({"data": q}).encode(),
                                 headers={"User-Agent": "candemsoft-site-build/1.0"})
    data = json.load(urllib.request.urlopen(req, timeout=120))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    json.dump(data, open(CACHE, "w"))
    return data

d = fetch()
lat0 = (BB[0] + BB[2]) / 2
KX, KY = math.cos(math.radians(lat0)) * 111320, 110540  # metres per degree
def metres(a, b): return math.hypot((a[1] - b[1]) * KX, (a[0] - b[0]) * KY)

# --- route: shortest walkable paths between waypoints -------------------------------------------
WALK = {"footway": .8, "pedestrian": .8, "path": .8, "cycleway": .8, "residential": 1, "living_street": 1, "tertiary": 1,
        "unclassified": 1, "service": 1, "secondary": 1.3, "primary": 1.3, "steps": 2}
graph, coord = {}, {}
for el in d["elements"]:
    if "nodes" not in el: continue
    for nid, g in zip(el["nodes"], el["geometry"]): coord[nid] = (g["lat"], g["lon"])
    t = el.get("tags", {}); w = WALK.get(t.get("highway"))
    if w is None or t.get("access") == "private": continue
    for a, b in zip(el["nodes"], el["nodes"][1:]):
        m = metres(coord[a], coord[b])
        graph.setdefault(a, []).append((b, m * w)); graph.setdefault(b, []).append((a, m * w))

def nearest(p): return min(graph, key=lambda n: metres(coord[n], p))
def shortest(a, b):
    best, prev, q = {a: 0}, {a: None}, [(0, a)]
    while q:
        c, u = heapq.heappop(q)
        if u == b: break
        if c > best[u]: continue
        for v, w in graph[u]:
            if c + w < best.get(v, 1e18): best[v], prev[v] = c + w, u; heapq.heappush(q, (c + w, v))
    path = [b]
    while prev[path[-1]] is not None: path.append(prev[path[-1]])
    return path[::-1]

nodes = []
for a, b in zip(WAYPOINTS, WAYPOINTS[1:] + WAYPOINTS[:1]):
    seg = shortest(nearest(a), nearest(b)); nodes += seg if not nodes else seg[1:]
route = [coord[n] for n in nodes]
length = sum(metres(a, b) for a, b in zip(route, route[1:]))

# --- projection: fit the route (plus padding) into the view box --------------------------------
xs = [(p[1] - BB[1]) * KX for p in route]; ys = [(BB[2] - p[0]) * KY for p in route]
cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
scale = min((VIEW_W - 2 * PAD) / (max(xs) - min(xs)), (VIEW_H - 2 * PAD) / (max(ys) - min(ys)))
def P(p): return ((p[1] - BB[1]) * KX - cx) * scale + VIEW_W / 2, ((BB[2] - p[0]) * KY - cy) * scale + VIEW_H / 2
def inside(pts): return any(-40 < x < VIEW_W + 40 and -40 < y < VIEW_H + 40 for x, y in pts)
def simplify(pts, tol=0.8):
    """Douglas-Peucker: drop points that don't move the line by more than tol view units."""
    if len(pts) < 3: return pts
    (ax, ay), (bx, by) = pts[0], pts[-1]
    L = math.hypot(bx - ax, by - ay)
    # distance to the chord; for a closed loop (ends meet) distance to that point instead
    dist = (lambda x, y: abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / L) if L > 1e-6 else (lambda x, y: math.hypot(x - ax, y - ay))
    i, dmax = max(((i, dist(x, y)) for i, (x, y) in enumerate(pts[1:-1], 1)), key=lambda t: t[1])
    return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol) if dmax > tol else [pts[0], pts[-1]]
def path(pts, close=False, tol=0.8):
    q = simplify(pts, tol) if tol else pts
    out = f"M{q[0][0]:.0f} {q[0][1]:.0f}" + "".join(f"l{x - px:.0f} {y - py:.0f}" for (px, py), (x, y) in zip(
        [(round(a), round(b)) for a, b in q], [(round(a), round(b)) for a, b in q[1:]]))
    return out + ("z" if close else "")

CLASS = {"primary": "major", "secondary": "major", "trunk": "major", "tertiary": "major", "residential": "minor",
         "living_street": "minor", "pedestrian": "minor", "unclassified": "minor"}
# footways and service roads are left out: they double the page weight for little visual gain
layers = {"park": [], "major": [], "minor": [], "coast": []}
for el in d["elements"]:
    t = el.get("tags", {}); pts = [P((g["lat"], g["lon"])) for g in el.get("geometry", [])]
    if not pts or not inside(pts): continue
    if t.get("leisure") == "park": layers["park"].append(path(pts, True))
    elif t.get("natural") == "coastline": layers["coast"].append(path(pts))
    elif t.get("highway") in CLASS: layers[CLASS[t["highway"]]].append(path(pts))

pts = [P(p) for p in route]
route_d = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in simplify(pts, 0.3))
json.dump({
    "viewBox": [VIEW_W, VIEW_H],
    "layers": {k: "".join(v) for k, v in layers.items()},
    "route": route_d,
    "start": [round(pts[0][0], 1), round(pts[0][1], 1)],
    "metres": round(length),
    "place": "Moda, Kadıköy",
}, open(OUT, "w"), separators=(",", ":"))
print(f"route {length / 1000:.2f} km, {len(route)} points → {os.path.relpath(OUT)} ({os.path.getsize(OUT) // 1024} KB)")
