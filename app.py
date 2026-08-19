from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def orientations(l, w, h, rotate=True):
    if not rotate:
        return [(l,w,h)]
    vals = {(l,w,h),(l,h,w),(w,l,h),(w,h,l),(h,l,w),(h,w,l)}
    return list(vals)

def pack(container, package_types):
    L, W, H = container["length"], container["width"], container["height"]
    max_weight = container["max_weight"]

    items = []
    for p in package_types:
        for i in range(int(p["amount"])):
            items.append({
                **p,
                "instance": i + 1,
                "volume": p["length"] * p["width"] * p["height"]
            })

    # Priority first, then larger boxes.
    items.sort(key=lambda x: (-x.get("importance",1), -x["volume"]))

    # Candidate anchor points. This is a compact heuristic, not an exact solver.
    anchors = [(0.0, 0.0, 0.0)]
    placed, unpacked = [], []
    total_weight = 0.0

    def overlaps(a, b):
        return not (
            a["x"] + a["length"] <= b["x"] or b["x"] + b["length"] <= a["x"] or
            a["y"] + a["width"] <= b["y"] or b["y"] + b["width"] <= a["y"] or
            a["z"] + a["height"] <= b["z"] or b["z"] + b["height"] <= a["z"]
        )

    for item in items:
        if total_weight + item["weight"] > max_weight:
            unpacked.append(item)
            continue

        found = None
        # lowest z, then y, then x tends to produce compact layers
        for x, y, z in sorted(set(anchors), key=lambda a:(a[2],a[1],a[0])):
            for l,w,h in orientations(item["length"],item["width"],item["height"],item.get("auto_rotate",True)):
                if x+l > L or y+w > W or z+h > H:
                    continue
                candidate = {"x":x,"y":y,"z":z,"length":l,"width":w,"height":h}
                if any(overlaps(candidate, q) for q in placed):
                    continue
                found = candidate
                break
            if found:
                break

        if not found:
            unpacked.append(item)
            continue

        box = {**found, "name":item["name"], "color":item["color"], "weight":item["weight"]}
        placed.append(box)
        total_weight += item["weight"]
        anchors += [
            (box["x"]+box["length"], box["y"], box["z"]),
            (box["x"], box["y"]+box["width"], box["z"]),
            (box["x"], box["y"], box["z"]+box["height"])
        ]

    container_volume = L*W*H
    used_volume = sum(b["length"]*b["width"]*b["height"] for b in placed)
    unpacked_volume = sum(i["volume"] for i in unpacked)

    return {
        "placed": placed,
        "stats": {
            "space_utilization": round((used_volume/container_volume*100) if container_volume else 0, 2),
            "used_volume": round(used_volume, 2),
            "residual_volume": round(container_volume-used_volume, 2),
            "unpacked_volume": round(unpacked_volume, 2),
            "unpacked_items": len(unpacked),
            "packed_items": len(placed),
            "packed_weight": round(total_weight, 2)
        }
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/api/pack")
def api_pack():
    data = request.get_json()
    try:
        result = pack(data["container"], data["packages"])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
