from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def orientations(l, w, h, rotate=True):
    if not rotate:
        return [(l, w, h)]

    vals = {
        (l, w, h),
        (l, h, w),
        (w, l, h),
        (w, h, l),
        (h, l, w),
        (h, w, l)
    }

    return list(vals)


def pack(container, package_types):

    # --------------------------------------------------
    # CONTAINER INFORMATION
    # --------------------------------------------------

    L = float(container["length"])
    W = float(container["width"])
    H = float(container["height"])

    max_weight = float(container["max_weight"])


    # --------------------------------------------------
    # CREATE INDIVIDUAL PACKAGE ITEMS
    # --------------------------------------------------

    items = []

    for p in package_types:

        amount = int(p["amount"])

        for i in range(amount):

            item = {
                **p,
                "instance": i + 1,
                "volume":
                    float(p["length"])
                    * float(p["width"])
                    * float(p["height"])
            }

            items.append(item)


    # --------------------------------------------------
    # SORT PACKAGES
    # Priority first, then larger boxes
    # --------------------------------------------------

    items.sort(
        key=lambda x: (
            -x.get("importance", 1),
            -x["volume"]
        )
    )


    # --------------------------------------------------
    # PACKING SETUP
    # --------------------------------------------------

    anchors = [(0.0, 0.0, 0.0)]

    placed = []
    unpacked = []

    total_weight = 0.0


    # --------------------------------------------------
    # COLLISION CHECK
    # --------------------------------------------------

    def overlaps(a, b):

        return not (

            a["x"] + a["length"] <= b["x"]

            or

            b["x"] + b["length"] <= a["x"]

            or

            a["y"] + a["width"] <= b["y"]

            or

            b["y"] + b["width"] <= a["y"]

            or

            a["z"] + a["height"] <= b["z"]

            or

            b["z"] + b["height"] <= a["z"]

        )


    # --------------------------------------------------
    # PACK ITEMS
    # --------------------------------------------------

    for item in items:

        item_weight = float(item["weight"])

        # Do not exceed maximum container weight
        if total_weight + item_weight > max_weight:

            unpacked.append(item)

            continue


        found = None


        # Lowest Z first
        # Then Y
        # Then X

        sorted_anchors = sorted(
            set(anchors),
            key=lambda a: (
                a[2],
                a[1],
                a[0]
            )
        )


        for x, y, z in sorted_anchors:

            possible_orientations = orientations(

                float(item["length"]),

                float(item["width"]),

                float(item["height"]),

                item.get(
                    "auto_rotate",
                    True
                )
            )


            for l, w, h in possible_orientations:

                # Check container boundaries
                if (
                    x + l > L
                    or
                    y + w > W
                    or
                    z + h > H
                ):

                    continue


                candidate = {

                    "x": x,

                    "y": y,

                    "z": z,

                    "length": l,

                    "width": w,

                    "height": h

                }


                # Check collision with already packed boxes
                if any(
                    overlaps(candidate, q)
                    for q in placed
                ):

                    continue


                found = candidate

                break


            if found:
                break


        # Could not fit package
        if not found:

            unpacked.append(item)

            continue


        # --------------------------------------------------
        # SAVE PLACED BOX
        # --------------------------------------------------

        box = {

            **found,

            "name": item["name"],

            "color": item["color"],

            "weight": item_weight,

            "instance": item["instance"]

        }


        placed.append(box)


        total_weight += item_weight


        # --------------------------------------------------
        # CREATE NEW POSSIBLE ANCHOR POINTS
        # --------------------------------------------------

        anchors += [

            (
                box["x"] + box["length"],
                box["y"],
                box["z"]
            ),

            (
                box["x"],
                box["y"] + box["width"],
                box["z"]
            ),

            (
                box["x"],
                box["y"],
                box["z"] + box["height"]
            )

        ]


    # --------------------------------------------------
    # VOLUME CALCULATIONS
    # --------------------------------------------------

    container_volume = L * W * H


    used_volume = sum(

        b["length"]
        * b["width"]
        * b["height"]

        for b in placed

    )


    unpacked_volume = sum(

        i["volume"]

        for i in unpacked

    )


    # ==================================================
    # LEFT / RIGHT WEIGHT DISTRIBUTION
    # ==================================================

    left_weight = 0.0

    right_weight = 0.0


    # Container width divided into two equal halves
    container_center = W / 2


    for box in placed:

        # --------------------------------------------------
        # CENTER OF THE PACKAGE ACROSS CONTAINER WIDTH
        # --------------------------------------------------

        box_center = (
            box["y"]
            + (box["width"] / 2)
        )


        box_weight = float(
            box.get(
                "weight",
                0
            )
        )


        # --------------------------------------------------
        # LEFT OR RIGHT SIDE
        # --------------------------------------------------

        if box_center < container_center:

            left_weight += box_weight

        else:

            right_weight += box_weight


    # --------------------------------------------------
    # WEIGHT DIFFERENCE
    # --------------------------------------------------

    weight_difference = abs(

        left_weight

        - right_weight

    )


    # --------------------------------------------------
    # PACKED WEIGHT
    # --------------------------------------------------

    packed_weight = (

        left_weight

        + right_weight

    )


    # --------------------------------------------------
    # BALANCE PERCENTAGE
    # --------------------------------------------------

    if packed_weight > 0:

        balance_percentage = (

            1

            - (
                weight_difference
                / packed_weight
            )

        ) * 100

    else:

        balance_percentage = 100.0


    # --------------------------------------------------
    # OPTIONAL BALANCE STATUS
    # --------------------------------------------------

    if balance_percentage >= 95:

        balance_status = "Well Balanced"

    elif balance_percentage >= 85:

        balance_status = "Moderately Balanced"

    else:

        balance_status = "Unbalanced"


    # --------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------

    return {

        "placed": placed,

        "stats": {

            "space_utilization": round(

                (
                    used_volume
                    / container_volume
                    * 100
                )

                if container_volume

                else 0,

                2
            ),

            "used_volume":
                round(
                    used_volume,
                    2
                ),

            "residual_volume":
                round(
                    container_volume
                    - used_volume,
                    2
                ),

            "unpacked_volume":
                round(
                    unpacked_volume,
                    2
                ),

            "unpacked_items":
                len(unpacked),

            "packed_items":
                len(placed),

            "packed_weight":
                round(
                    packed_weight,
                    2
                ),

            # ----------------------------------------------
            # WEIGHT DISTRIBUTION
            # ----------------------------------------------

            "left_weight":
                round(
                    left_weight,
                    2
                ),

            "right_weight":
                round(
                    right_weight,
                    2
                ),

            "weight_difference":
                round(
                    weight_difference,
                    2
                ),

            "balance_percentage":
                round(
                    balance_percentage,
                    1
                ),

            "balance_status":
                balance_status
        }
    }


# --------------------------------------------------
# HOME PAGE
# --------------------------------------------------

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# --------------------------------------------------
# PACKING API
# --------------------------------------------------

@app.post("/api/pack")
def api_pack():

    data = request.get_json()

    try:

        result = pack(

            data["container"],

            data["packages"]

        )

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 400


# --------------------------------------------------
# RUN FLASK APPLICATION
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )

    