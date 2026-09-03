import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let pkgCount = 0;

const packages =
    document.getElementById("packages");

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let animationId = null;

let activeDragCleanup = null;

const CONESTOGA_SIDE_LIMIT = 34000;


/* =========================================================
   CONTAINER ELEMENTS
========================================================= */

const containerName =
    document.getElementById("cname");

const containerLength =
    document.getElementById("cl");

const containerWidth =
    document.getElementById("cw");

const containerHeight =
    document.getElementById("ch");

const lengthMM =
    document.getElementById("lengthMM");

const widthMM =
    document.getElementById("widthMM");

const heightMM =
    document.getElementById("heightMM");


/* =========================================================
   UNIT CONVERSION
========================================================= */

function feetToMM(feet) {
    return feet * 304.8;
}


function updateMMValues() {

    const l =
        Number(containerLength.value);

    const w =
        Number(containerWidth.value);

    const h =
        Number(containerHeight.value);


    lengthMM.textContent =
        l
            ? `${Math.round(feetToMM(l))} mm`
            : "";

    widthMM.textContent =
        w
            ? `${Math.round(feetToMM(w))} mm`
            : "";

    heightMM.textContent =
        h
            ? `${Math.round(feetToMM(h))} mm`
            : "";
}


/* =========================================================
   CONTAINER TYPE
========================================================= */

function updateContainer() {

    const selected =
        containerName.value;


    /* =====================================================
       TRUCK
    ===================================================== */

    if (selected === "Truck") {

        containerLength.value = 53;
        containerWidth.value = 8.33;
        containerHeight.value = 9.17;

        containerLength.readOnly = true;
        containerWidth.readOnly = true;
        containerHeight.readOnly = true;

        containerLength.removeAttribute("min");
        containerLength.removeAttribute("max");

        containerWidth.removeAttribute("min");
        containerWidth.removeAttribute("max");

        containerHeight.removeAttribute("min");
        containerHeight.removeAttribute("max");

        containerLength.style.backgroundColor =
            "#eeeeee";

        containerWidth.style.backgroundColor =
            "#eeeeee";

        containerHeight.style.backgroundColor =
            "#eeeeee";

        updateMMValues();

        return;
    }


    /* =====================================================
       CONESTOGA
    ===================================================== */

    if (selected === "Conestoga") {

        containerLength.value = 48;

        containerLength.min = 48;
        containerLength.max = 53;

        containerLength.readOnly = false;

        containerWidth.value = 8.6;
        containerHeight.value = 6.6;

        containerWidth.readOnly = true;
        containerHeight.readOnly = true;

        containerLength.style.backgroundColor =
            "#ffffff";

        containerWidth.style.backgroundColor =
            "#eeeeee";

        containerHeight.style.backgroundColor =
            "#eeeeee";

        updateMMValues();

        return;
    }


    /* =====================================================
       CUSTOM
    ===================================================== */

    if (selected === "Custom") {

        containerLength.value = "";
        containerWidth.value = "";
        containerHeight.value = "";

        containerLength.readOnly = false;
        containerWidth.readOnly = false;
        containerHeight.readOnly = false;

        containerLength.removeAttribute("min");
        containerLength.removeAttribute("max");

        containerWidth.removeAttribute("min");
        containerWidth.removeAttribute("max");

        containerHeight.removeAttribute("min");
        containerHeight.removeAttribute("max");

        containerLength.style.backgroundColor =
            "#ffffff";

        containerWidth.style.backgroundColor =
            "#ffffff";

        containerHeight.style.backgroundColor =
            "#ffffff";

        updateMMValues();
    }
}


/* =========================================================
   CONTAINER EVENTS
========================================================= */

containerName.addEventListener(
    "change",
    updateContainer
);

containerLength.addEventListener(
    "input",
    updateMMValues
);

containerWidth.addEventListener(
    "input",
    updateMMValues
);

containerHeight.addEventListener(
    "input",
    updateMMValues
);

updateContainer();


/* =========================================================
   ADD PACKAGE
========================================================= */

function addPackage() {

    pkgCount++;

    const d =
        document.createElement("div");

    d.className =
        "package";


    const colors = [
        "#ef4444",
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#8b5cf6"
    ];


    d.innerHTML = `

        <div class="grid">

            <label>
                Name

                <input
                    class="pname"
                    value="Package ${pkgCount}"
                >
            </label>


            <label>
                Length (ft)

                <input
                    class="pl"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >

                <small class="packageLengthMM">
                    609.6 mm
                </small>
            </label>


            <label>
                Width (ft)

                <input
                    class="pw"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >

                <small class="packageWidthMM">
                    609.6 mm
                </small>
            </label>


            <label>
                Height (ft)

                <input
                    class="ph"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >

                <small class="packageHeightMM">
                    609.6 mm
                </small>
            </label>


            <label>
                Amount

                <input
                    class="pa"
                    type="number"
                    value="1"
                    min="1"
                >
            </label>

        </div>


        <div class="grid">

            <label>
                Weight (lbs)

                <input
                    class="pweight"
                    type="number"
                    value="1"
                    min="0"
                    step="0.1"
                >

                <small class="weightKg">
                    0.45 kg
                </small>
            </label>


            <label>
                Box Color

                <input
                    class="pcolor"
                    type="color"
                    value="${
                        colors[
                            (pkgCount - 1) %
                            colors.length
                        ]
                    }"
                >
            </label>


            <label>
                Importance

                <input
                    class="pimportance"
                    type="number"
                    value="1"
                    min="1"
                >
            </label>


            <label>
                Auto Rotate

                <select class="protate">

                    <option value="true">
                        Yes
                    </option>

                    <option value="false">
                        No
                    </option>

                </select>
            </label>


            <label>
                &nbsp;

                <button
                    type="button"
                    class="remove"
                >
                    Remove
                </button>
            </label>

        </div>
    `;


    packages.appendChild(d);


    /* =====================================================
       DIMENSION CONVERSION
    ===================================================== */

    const lengthInput =
        d.querySelector(".pl");

    const widthInput =
        d.querySelector(".pw");

    const heightInput =
        d.querySelector(".ph");


    const lengthDisplay =
        d.querySelector(
            ".packageLengthMM"
        );

    const widthDisplay =
        d.querySelector(
            ".packageWidthMM"
        );

    const heightDisplay =
        d.querySelector(
            ".packageHeightMM"
        );


    function updateDimensions() {

        const l =
            Number(lengthInput.value) || 0;

        const w =
            Number(widthInput.value) || 0;

        const h =
            Number(heightInput.value) || 0;


        lengthDisplay.textContent =
            `${feetToMM(l).toFixed(1)} mm`;

        widthDisplay.textContent =
            `${feetToMM(w).toFixed(1)} mm`;

        heightDisplay.textContent =
            `${feetToMM(h).toFixed(1)} mm`;
    }


    lengthInput.addEventListener(
        "input",
        updateDimensions
    );

    widthInput.addEventListener(
        "input",
        updateDimensions
    );

    heightInput.addEventListener(
        "input",
        updateDimensions
    );

    updateDimensions();


    /* =====================================================
       WEIGHT CONVERSION
    ===================================================== */

    const weightInput =
        d.querySelector(".pweight");

    const weightKg =
        d.querySelector(".weightKg");


    function updateWeight() {

        const lbs =
            Number(weightInput.value) || 0;

        const kg =
            lbs * 0.45359237;


        weightKg.textContent =
            `${kg.toFixed(2)} kg`;
    }


    weightInput.addEventListener(
        "input",
        updateWeight
    );

    updateWeight();


    /* =====================================================
       REMOVE
    ===================================================== */

    d.querySelector(
        ".remove"
    ).onclick = () => {

        d.remove();
    };
}


/* =========================================================
   ADD PACKAGE BUTTON
========================================================= */

document.getElementById(
    "add"
).onclick =
    addPackage;

addPackage();


/* =========================================================
   HELPERS
========================================================= */

function getNumber(id) {

    return Number(
        document.getElementById(id).value
    );
}


/* =========================================================
   COLLECT DATA
========================================================= */

function collect() {

    const packageElements =
        document.querySelectorAll(
            ".package"
        );


    const packageData =
        [...packageElements].map(

            p => ({

                name:
                    p.querySelector(
                        ".pname"
                    ).value,

                length:
                    Number(
                        p.querySelector(
                            ".pl"
                        ).value
                    ),

                width:
                    Number(
                        p.querySelector(
                            ".pw"
                        ).value
                    ),

                height:
                    Number(
                        p.querySelector(
                            ".ph"
                        ).value
                    ),

                amount:
                    Number(
                        p.querySelector(
                            ".pa"
                        ).value
                    ),

                weight:
                    Number(
                        p.querySelector(
                            ".pweight"
                        ).value
                    ),

                color:
                    p.querySelector(
                        ".pcolor"
                    ).value,

                importance:
                    Number(
                        p.querySelector(
                            ".pimportance"
                        ).value
                    ),

                auto_rotate:
                    p.querySelector(
                        ".protate"
                    ).value === "true"
            })
        );


    return {

        container: {

            name:
                document.getElementById(
                    "cname"
                ).value,

            length:
                getNumber("cl"),

            width:
                getNumber("cw"),

            height:
                getNumber("ch"),

            max_weight:
                getNumber("cweight")
        },

        packages:
            packageData
    };
}


/* =========================================================
   GENERATE
========================================================= */

document.getElementById(
    "generate"
).onclick = async () => {

    const data =
        collect();


    if (
        data.container.length <= 0 ||
        data.container.width <= 0 ||
        data.container.height <= 0
    ) {

        alert(
            "Container dimensions must be positive."
        );

        return;
    }


    if (
        data.container.name ===
            "Conestoga" &&
        (
            data.container.length < 48 ||
            data.container.length > 53
        )
    ) {

        alert(
            "Conestoga length must be between 48 ft and 53 ft."
        );

        return;
    }


    if (
        data.packages.length === 0
    ) {

        alert(
            "Please add at least one package."
        );

        return;
    }


    for (
        const p of data.packages
    ) {

        if (
            p.length <= 0 ||
            p.width <= 0 ||
            p.height <= 0 ||
            p.amount <= 0 ||
            p.weight < 0
        ) {

            alert(
                "Please enter valid package values."
            );

            return;
        }
    }


    try {

        const response =
            await fetch(
                "/api/pack",
                {
                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const output =
            await response.json();


        if (
            output.error
        ) {

            alert(
                output.error
            );

            return;
        }


        displayStats(
            output.stats,
            data.container
        );


        render3D(
            data.container,
            output.placed,
            output.stats
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to generate packed container."
        );
    }
};


/* =========================================================
   STATS
========================================================= */

function displayStats(
    statsData,
    container
) {

    const packedWeight =
        Number(
            statsData.packed_weight
        ) || 0;


    /* =====================================================
       TRUCK
    ===================================================== */

    if (
        container.name === "Truck"
    ) {

        displayTruckStats(
            statsData,
            container,
            packedWeight
        );

        return;
    }


    /* =====================================================
       CONESTOGA
    ===================================================== */

    if (
        container.name === "Conestoga"
    ) {

        updateConestogaStats(

            Number(
                statsData.left_weight
            ) || 0,

            Number(
                statsData.right_weight
            ) || 0,

            statsData.packed_items
        );

        return;
    }


    /* =====================================================
       CUSTOM
    ===================================================== */

    document.getElementById(
        "stats"
    ).innerHTML = `

        <div class="packing-card">

            <h2>
                Packing Information
            </h2>

            <div class="summary-row">

                <span>
                    Packed Items:
                </span>

                <strong>
                    ${statsData.packed_items}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Packed Weight:
                </span>

                <strong>
                    ${packedWeight.toLocaleString()} lbs
                </strong>

            </div>

        </div>
    `;
}


/* =========================================================
   TRUCK STATS
========================================================= */

function displayTruckStats(
    statsData,
    container,
    packedWeight
) {

    const stats =
        document.getElementById(
            "stats"
        );


    const maxWeight =
        Number(
            container.max_weight
        ) || 0;


    const remaining =
        Math.max(
            0,
            maxWeight - packedWeight
        );


    const exceeded =
        packedWeight >
        maxWeight;


    stats.innerHTML = `

        <div class="packing-card">

            <h2>
                Truck Packing Information
            </h2>


            <div class="summary-row">

                <span>
                    Packed Items:
                </span>

                <strong>
                    ${statsData.packed_items}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Total Packed Weight:
                </span>

                <strong>
                    ${packedWeight.toLocaleString()} lbs
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Maximum Capacity:
                </span>

                <strong>
                    ${maxWeight.toLocaleString()} lbs
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Remaining Capacity:
                </span>

                <strong>
                    ${remaining.toLocaleString()} lbs
                </strong>

            </div>


            ${
                exceeded
                    ? `

                        <div
                            class="balance-box"
                            style="
                                background:#fef2f2;
                                border-color:#dc2626;
                            "
                        >

                            <div
                                class="balance-title"
                                style="color:#dc2626;"
                            >
                                ❌ Weight Capacity Exceeded
                            </div>


                            <div class="balance-description">

                                Truck exceeds its maximum
                                weight by

                                <strong>

                                    ${
                                        (
                                            packedWeight -
                                            maxWeight
                                        ).toLocaleString()
                                    } lbs

                                </strong>.

                            </div>

                        </div>

                    `
                    : `

                        <div class="balance-box">

                            <div class="balance-title">
                                ✅ Within Weight Capacity
                            </div>

                        </div>

                    `
            }

        </div>
    `;
}


/* =========================================================
   CONESTOGA STATS
========================================================= */

function updateConestogaStats(
    leftWeight,
    rightWeight,
    packedItems
) {

    const stats =
        document.getElementById(
            "stats"
        );


    const leftExceeded =
        leftWeight >
        CONESTOGA_SIDE_LIMIT;


    const rightExceeded =
        rightWeight >
        CONESTOGA_SIDE_LIMIT;


    const limitExceeded =
        leftExceeded ||
        rightExceeded;


    const totalWeight =
        leftWeight +
        rightWeight;


    const difference =
        Math.abs(
            leftWeight -
            rightWeight
        );


    const balance =
        totalWeight > 0

            ? Math.max(
                0,
                (
                    1 -
                    difference /
                    totalWeight
                ) * 100
            )

            : 100;


    let status =
        "";

    let description =
        "";


    if (
        limitExceeded
    ) {

        status =
            "❌ UNBALANCED — WEIGHT LIMIT EXCEEDED";


        if (
            leftExceeded &&
            rightExceeded
        ) {

            description =
                "Both sides exceed the 34,000 lb limit. Unload or reposition packages.";
        }

        else if (
            leftExceeded
        ) {

            description =
                `Left side exceeds the limit by ${
                    (
                        leftWeight -
                        CONESTOGA_SIDE_LIMIT
                    ).toLocaleString()
                } lbs.`;
        }

        else {

            description =
                `Right side exceeds the limit by ${
                    (
                        rightWeight -
                        CONESTOGA_SIDE_LIMIT
                    ).toLocaleString()
                } lbs.`;
        }
    }

    else if (
        balance >= 95
    ) {

        status =
            "✅ BALANCED";

        description =
            "Both sides are within the 34,000 lb limit and the load is well balanced.";
    }

    else {

        status =
            "⚠️ UNBALANCED";

        description =
            "Both sides are within the 34,000 lb limit, but the load should be repositioned.";
    }


    stats.innerHTML = `

        <div class="packing-card">

            <h2>
                Conestoga Weight Distribution
            </h2>


            <div class="summary-row">

                <span>
                    Packed Items:
                </span>

                <strong>
                    ${packedItems}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Total Weight:
                </span>

                <strong>
                    ${totalWeight.toLocaleString()} lbs
                </strong>

            </div>


            <hr>


            <h3>
                Side Limit:
                ${CONESTOGA_SIDE_LIMIT.toLocaleString()} lbs
            </h3>


            <div class="weight-row">

                <span>
                    🔵 Left Side:
                </span>

                <strong
                    style="
                        color:${
                            leftExceeded
                                ? "#dc2626"
                                : "#15803d"
                        };
                    "
                >

                    ${leftWeight.toLocaleString()}
                    /
                    ${CONESTOGA_SIDE_LIMIT.toLocaleString()}
                    lbs

                </strong>

            </div>


            <div class="weight-row">

                <span>
                    Left Remaining:
                </span>

                <strong>

                    ${
                        leftExceeded

                            ? `EXCEEDED BY ${
                                (
                                    leftWeight -
                                    CONESTOGA_SIDE_LIMIT
                                ).toLocaleString()
                            } lbs`

                            : `${
                                (
                                    CONESTOGA_SIDE_LIMIT -
                                    leftWeight
                                ).toLocaleString()
                            } lbs`
                    }

                </strong>

            </div>


            <div class="weight-row">

                <span>
                    🟢 Right Side:
                </span>

                <strong
                    style="
                        color:${
                            rightExceeded
                                ? "#dc2626"
                                : "#15803d"
                        };
                    "
                >

                    ${rightWeight.toLocaleString()}
                    /
                    ${CONESTOGA_SIDE_LIMIT.toLocaleString()}
                    lbs

                </strong>

            </div>


            <div class="weight-row">

                <span>
                    Right Remaining:
                </span>

                <strong>

                    ${
                        rightExceeded

                            ? `EXCEEDED BY ${
                                (
                                    rightWeight -
                                    CONESTOGA_SIDE_LIMIT
                                ).toLocaleString()
                            } lbs`

                            : `${
                                (
                                    CONESTOGA_SIDE_LIMIT -
                                    rightWeight
                                ).toLocaleString()
                            } lbs`
                    }

                </strong>

            </div>


            <hr>


            <div class="weight-row">

                <span>
                    Difference:
                </span>

                <strong>
                    ${difference.toLocaleString()} lbs
                </strong>

            </div>


            <div class="weight-row">

                <span>
                    Balance:
                </span>

                <strong>
                    ${balance.toFixed(1)}%
                </strong>

            </div>


            <div
                class="balance-box"
                style="
                    ${
                        limitExceeded
                            ? `
                                background:#fef2f2;
                                border-color:#dc2626;
                            `
                            : ""
                    }
                "
            >

                <div
                    class="balance-title"
                    style="
                        ${
                            limitExceeded
                                ? "color:#dc2626;"
                                : ""
                        }
                    "
                >

                    ${status}

                </div>


                <div class="balance-description">

                    ${description}

                </div>

            </div>


            ${
                limitExceeded
                    ? `

                        <div
                            style="
                                margin-top:15px;
                                padding:14px;
                                color:#991b1b;
                                background:#fee2e2;
                                border:2px solid #dc2626;
                                border-radius:6px;
                                font-weight:bold;
                            "
                        >

                            ⚠️ LOAD LIMIT ERROR:
                            Reduce the overloaded side
                            below 34,000 lbs.

                        </div>

                    `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   CLEANUP 3D
========================================================= */

function cleanup3D() {

    if (
        activeDragCleanup
    ) {

        activeDragCleanup();

        activeDragCleanup =
            null;
    }


    if (
        animationId
    ) {

        cancelAnimationFrame(
            animationId
        );

        animationId =
            null;
    }


    if (
        controls
    ) {

        controls.dispose();

        controls =
            null;
    }


    if (
        renderer
    ) {

        renderer.dispose();


        if (
            renderer.domElement &&
            renderer.domElement.parentNode
        ) {

            renderer.domElement.remove();
        }


        renderer =
            null;
    }


    scene =
        null;

    camera =
        null;
}


/* =========================================================
   DYNAMIC WEIGHT LABEL
========================================================= */

function createWeightLabel(
    text,
    borderColor
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        640;

    canvas.height =
        160;


    const context =
        canvas.getContext(
            "2d"
        );


    function draw(
        newText
    ) {

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.fillStyle =
            "rgba(255,255,255,0.95)";


        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.strokeStyle =
            borderColor;


        context.lineWidth =
            8;


        context.strokeRect(
            4,
            4,
            canvas.width - 8,
            canvas.height - 8
        );


        context.font =
            "bold 42px Arial";


        context.fillStyle =
            "#111111";


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        context.fillText(
            newText,
            canvas.width / 2,
            canvas.height / 2
        );
    }


    draw(text);


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            depthTest:
                false
        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.scale.set(
        13,
        3.25,
        1
    );


    sprite.renderOrder =
        999;


    sprite.userData.updateText =
        newText => {

            draw(newText);

            texture.needsUpdate =
                true;
        };


    return sprite;
}


/* =========================================================
   RENDER 3D
========================================================= */

function render3D(
    container,
    boxes,
    statsData
) {

    const host =
        document.getElementById(
            "viewer"
        );


    cleanup3D();

    host.innerHTML =
        "";


    const isConestoga =
        container.name ===
        "Conestoga";


    const draggableMeshes =
        [];


    let leftWeightLabel =
        null;


    let rightWeightLabel =
        null;


    /* =====================================================
       SCENE
    ===================================================== */

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0xf3f6f8
        );


    /* =====================================================
       CAMERA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(

            45,

            host.clientWidth /
            host.clientHeight,

            0.1,

            10000
        );


    /* =====================================================
       RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({

            antialias:
                true
        });


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        host.clientWidth,
        host.clientHeight
    );


    renderer.shadowMap.enabled =
        true;


    renderer.domElement.style.cursor =
        "grab";


    host.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LIGHTS
    ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );


    scene.add(
        ambientLight
    );


    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );


    directionalLight.position.set(

        container.length *
        1.5,

        container.height *
        2,

        container.width *
        2
    );


    scene.add(
        directionalLight
    );


    /* =====================================================
       CONTAINER
    ===================================================== */

    const containerGeometry =
        new THREE.BoxGeometry(

            container.length,

            container.height,

            container.width
        );


    const containerMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xbac4cc,

            transparent:
                true,

            opacity:
                0.06,

            side:
                THREE.DoubleSide
        });


    const containerMesh =
        new THREE.Mesh(

            containerGeometry,

            containerMaterial
        );


    containerMesh.position.set(

        container.length / 2,

        container.height / 2,

        container.width / 2
    );


    scene.add(
        containerMesh
    );


    /* =====================================================
       CONTAINER OUTLINE
    ===================================================== */

    const containerEdges =
        new THREE.EdgesGeometry(
            containerGeometry
        );


    const outline =
        new THREE.LineSegments(

            containerEdges,

            new THREE.LineBasicMaterial({
                color:
                    0x111111
            })
        );


    outline.position.copy(
        containerMesh.position
    );


    scene.add(
        outline
    );


    /* =====================================================
       CONESTOGA LEFT / RIGHT DIVIDER
    ===================================================== */

    if (
        isConestoga
    ) {

        const initialLeft =
            Number(
                statsData.left_weight
            ) || 0;


        const initialRight =
            Number(
                statsData.right_weight
            ) || 0;


        leftWeightLabel =
            createWeightLabel(

                `Left: ${
                    initialLeft
                        .toLocaleString()
                } lbs`,

                "#3b82f6"
            );


        leftWeightLabel.position.set(

            container.length *
            0.35,

            container.height +
            2.5,

            container.width *
            0.15
        );


        scene.add(
            leftWeightLabel
        );


        rightWeightLabel =
            createWeightLabel(

                `Right: ${
                    initialRight
                        .toLocaleString()
                } lbs`,

                "#22c55e"
            );


        rightWeightLabel.position.set(

            container.length *
            0.65,

            container.height +
            2.5,

            container.width *
            0.85
        );


        scene.add(
            rightWeightLabel
        );


        /* CENTER FLOOR LINE */

        const linePoints = [

            new THREE.Vector3(
                0,
                0.06,
                container.width / 2
            ),

            new THREE.Vector3(
                container.length,
                0.06,
                container.width / 2
            )
        ];


        const lineGeometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    linePoints
                );


        const centerLine =
            new THREE.Line(

                lineGeometry,

                new THREE.LineBasicMaterial({

                    color:
                        0xff0000
                })
            );


        scene.add(
            centerLine
        );


        /* TRANSPARENT DIVIDER WALL */

        const divider =
            new THREE.Mesh(

                new THREE.PlaneGeometry(

                    container.length,

                    container.height
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        0xff0000,

                    transparent:
                        true,

                    opacity:
                        0.06,

                    side:
                        THREE.DoubleSide,

                    depthWrite:
                        false
                })
            );


        divider.position.set(

            container.length / 2,

            container.height / 2,

            container.width / 2
        );


        scene.add(
            divider
        );
    }


    /* =====================================================
       PACKAGES
    ===================================================== */

    boxes.forEach(

        (box, index) => {

            const geometry =
                new THREE.BoxGeometry(

                    box.length,

                    box.height,

                    box.width
                );


            const material =
                new THREE.MeshLambertMaterial({

                    color:
                        box.color,

                    transparent:
                        true,

                    opacity:
                        0.9
                });


            const mesh =
                new THREE.Mesh(

                    geometry,

                    material
                );


            mesh.position.set(

                box.x +
                box.length / 2,

                box.z +
                box.height / 2,

                box.y +
                box.width / 2
            );


            mesh.userData = {

                packageMesh:
                    true,

                name:
                    box.name,

                index:
                    index + 1,

                weight:
                    Number(
                        box.weight
                    ) || 0,

                length:
                    Number(
                        box.length
                    ) || 0,

                width:
                    Number(
                        box.width
                    ) || 0,

                height:
                    Number(
                        box.height
                    ) || 0
            };


            const edges =
                new THREE.EdgesGeometry(
                    geometry
                );


            const boxOutline =
                new THREE.LineSegments(

                    edges,

                    new THREE.LineBasicMaterial({

                        color:
                            0x222222
                    })
                );


            mesh.add(
                boxOutline
            );


            scene.add(
                mesh
            );


            if (
                isConestoga
            ) {

                draggableMeshes.push(
                    mesh
                );
            }
        }
    );


    /* =====================================================
       GRID
    ===================================================== */

    const maxDimension =
        Math.max(

            container.length,

            container.width,

            container.height
        );


    const grid =
        new THREE.GridHelper(

            maxDimension * 2,

            20
        );


    grid.position.set(

        container.length / 2,

        0,

        container.width / 2
    );


    scene.add(
        grid
    );


    /* =====================================================
       AXES
    ===================================================== */

    const axes =
        new THREE.AxesHelper(

            maxDimension *
            0.5
        );


    scene.add(
        axes
    );


    /* =====================================================
       CAMERA POSITION
    ===================================================== */

    const centerX =
        container.length / 2;


    const centerY =
        container.height / 2;


    const centerZ =
        container.width / 2;


    const distance =
        maxDimension *
        1.15;


    camera.position.set(

        centerX +
        distance * 0.65,

        centerY +
        distance * 0.80,

        centerZ +
        distance * 0.65
    );


    camera.lookAt(

        centerX,

        centerY,

        centerZ
    );


    /* =====================================================
       ORBIT CONTROLS
    ===================================================== */

    controls =
        new OrbitControls(

            camera,

            renderer.domElement
        );


    controls.target.set(

        centerX,

        centerY,

        centerZ
    );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.05;


    controls.enableZoom =
        true;


    controls.enablePan =
        true;


    controls.update();


    /* =====================================================
       CUSTOM CONESTOGA DRAGGING
       DRAG ON TRAILER FLOOR
    ===================================================== */

    if (
        isConestoga &&
        draggableMeshes.length > 0
    ) {

        setupConestogaDragging(

            renderer.domElement,

            camera,

            controls,

            draggableMeshes,

            container,

            leftWeightLabel,

            rightWeightLabel
        );
    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate() {

        animationId =
            requestAnimationFrame(
                animate
            );


        controls.update();


        renderer.render(

            scene,

            camera
        );
    }


    animate();
}


/* =========================================================
   CUSTOM CONESTOGA DRAGGING
========================================================= */

function setupConestogaDragging(
    canvas,
    camera,
    orbitControls,
    meshes,
    container,
    leftLabel,
    rightLabel
) {

    const raycaster =
        new THREE.Raycaster();


    const pointer =
        new THREE.Vector2();


    let selectedMesh =
        null;


    let dragPlane =
        null;


    let dragOffset =
        new THREE.Vector3();


    function setPointer(
        event
    ) {

        const rect =
            canvas.getBoundingClientRect();


        pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1;


        pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) * 2 + 1;
    }


    function pointerDown(
        event
    ) {

        if (
            event.button !== 0
        ) {

            return;
        }


        setPointer(event);


        raycaster.setFromCamera(
            pointer,
            camera
        );


        const intersections =
            raycaster.intersectObjects(

                meshes,

                false
            );


        if (
            intersections.length === 0
        ) {

            return;
        }


        selectedMesh =
            intersections[0].object;


        orbitControls.enabled =
            false;


        canvas.style.cursor =
            "grabbing";


        /*
           Horizontal plane at the
           center-height of package.

           Pointer movement now maps
           directly to X/Z trailer floor.
        */

        dragPlane =
            new THREE.Plane(

                new THREE.Vector3(
                    0,
                    1,
                    0
                ),

                -selectedMesh.position.y
            );


        const point =
            new THREE.Vector3();


        if (
            raycaster.ray.intersectPlane(
                dragPlane,
                point
            )
        ) {

            dragOffset.copy(
                selectedMesh.position
            ).sub(
                point
            );
        }


        selectedMesh.material.opacity =
            1;


        canvas.setPointerCapture?.(
            event.pointerId
        );
    }


    function pointerMove(
        event
    ) {

        if (
            !selectedMesh
        ) {

            return;
        }


        setPointer(event);


        raycaster.setFromCamera(
            pointer,
            camera
        );


        const point =
            new THREE.Vector3();


        if (
            !raycaster.ray.intersectPlane(
                dragPlane,
                point
            )
        ) {

            return;
        }


        point.add(
            dragOffset
        );


        const halfLength =
            selectedMesh.userData.length /
            2;


        const halfWidth =
            selectedMesh.userData.width /
            2;


        const halfHeight =
            selectedMesh.userData.height /
            2;


        /* LENGTH */

        selectedMesh.position.x =
            THREE.MathUtils.clamp(

                point.x,

                halfLength,

                container.length -
                halfLength
            );


        /* WIDTH = LEFT / RIGHT */

        selectedMesh.position.z =
            THREE.MathUtils.clamp(

                point.z,

                halfWidth,

                container.width -
                halfWidth
            );


        /* KEEP ON FLOOR */

        selectedMesh.position.y =
            halfHeight;


        updateWeightsFrom3D(

            meshes,

            container,

            leftLabel,

            rightLabel
        );
    }


    function pointerUp(
        event
    ) {

        if (
            !selectedMesh
        ) {

            return;
        }


        selectedMesh.material.opacity =
            0.9;


        selectedMesh =
            null;


        dragPlane =
            null;


        orbitControls.enabled =
            true;


        canvas.style.cursor =
            "grab";


        updateWeightsFrom3D(

            meshes,

            container,

            leftLabel,

            rightLabel
        );


        canvas.releasePointerCapture?.(
            event.pointerId
        );
    }


    canvas.addEventListener(
        "pointerdown",
        pointerDown
    );


    canvas.addEventListener(
        "pointermove",
        pointerMove
    );


    canvas.addEventListener(
        "pointerup",
        pointerUp
    );


    canvas.addEventListener(
        "pointercancel",
        pointerUp
    );


    activeDragCleanup =
        () => {

            canvas.removeEventListener(
                "pointerdown",
                pointerDown
            );

            canvas.removeEventListener(
                "pointermove",
                pointerMove
            );

            canvas.removeEventListener(
                "pointerup",
                pointerUp
            );

            canvas.removeEventListener(
                "pointercancel",
                pointerUp
            );
        };
}


/* =========================================================
   LIVE LEFT / RIGHT CALCULATION
========================================================= */

function updateWeightsFrom3D(
    meshes,
    container,
    leftLabel,
    rightLabel
) {

    if (
        container.name !==
        "Conestoga"
    ) {

        return;
    }


    let leftWeight =
        0;


    let rightWeight =
        0;


    /*
       IMPORTANT

       X = trailer length
       Y = height
       Z = trailer width

       Therefore Z decides
       LEFT versus RIGHT.
    */

    const center =
        container.width /
        2;


    meshes.forEach(

        mesh => {

            const weight =
                Number(
                    mesh.userData.weight
                ) || 0;


            if (
                mesh.position.z <
                center
            ) {

                leftWeight +=
                    weight;
            }

            else {

                rightWeight +=
                    weight;
            }
        }
    );


    /* UPDATE INFORMATION PANEL */

    updateConestogaStats(

        leftWeight,

        rightWeight,

        meshes.length
    );


    /* UPDATE 3D LEFT LABEL */

    if (
        leftLabel &&
        leftLabel.userData.updateText
    ) {

        leftLabel.userData.updateText(

            `Left: ${
                leftWeight
                    .toLocaleString()
            } lbs`
        );
    }


    /* UPDATE 3D RIGHT LABEL */

    if (
        rightLabel &&
        rightLabel.userData.updateText
    ) {

        rightLabel.userData.updateText(

            `Right: ${
                rightWeight
                    .toLocaleString()
            } lbs`
        );
    }
}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(

    "resize",

    () => {

        if (
            !renderer ||
            !camera
        ) {

            return;
        }


        const host =
            document.getElementById(
                "viewer"
            );


        if (
            host.clientWidth === 0 ||
            host.clientHeight === 0
        ) {

            return;
        }


        camera.aspect =

            host.clientWidth /
            host.clientHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(

            host.clientWidth,

            host.clientHeight
        );
    }
);