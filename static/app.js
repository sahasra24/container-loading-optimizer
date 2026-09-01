import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let pkgCount = 0;

const packages = document.getElementById("packages");

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let animationId = null;


/* =========================================================
   CONTAINER ELEMENTS
========================================================= */

const containerName = document.getElementById("cname");
const containerLength = document.getElementById("cl");
const containerWidth = document.getElementById("cw");
const containerHeight = document.getElementById("ch");

const lengthMM = document.getElementById("lengthMM");
const widthMM = document.getElementById("widthMM");
const heightMM = document.getElementById("heightMM");


/* =========================================================
   UNIT CONVERSION
========================================================= */

function feetToMM(feet) {
    return feet * 304.8;
}


function updateMMValues() {

    const l = Number(containerLength.value);
    const w = Number(containerWidth.value);
    const h = Number(containerHeight.value);

    lengthMM.textContent =
        l ? `${Math.round(feetToMM(l))} mm` : "";

    widthMM.textContent =
        w ? `${Math.round(feetToMM(w))} mm` : "";

    heightMM.textContent =
        h ? `${Math.round(feetToMM(h))} mm` : "";
}


/* =========================================================
   CONTAINER TYPE SELECTION
========================================================= */

function updateContainer() {

    const selected = containerName.value;


    /* -----------------------------------------------------
       TRUCK
    ----------------------------------------------------- */

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

        containerLength.style.backgroundColor = "#eeeeee";
        containerWidth.style.backgroundColor = "#eeeeee";
        containerHeight.style.backgroundColor = "#eeeeee";

        updateMMValues();

        return;
    }


    /* -----------------------------------------------------
       CONESTOGA
    ----------------------------------------------------- */

    if (selected === "Conestoga") {

        containerLength.value = 48;

        containerLength.min = 48;
        containerLength.max = 53;

        containerLength.readOnly = false;

        containerWidth.value = 8.6;
        containerWidth.readOnly = true;

        containerHeight.value = 6.6;
        containerHeight.readOnly = true;

        containerLength.style.backgroundColor = "#ffffff";
        containerWidth.style.backgroundColor = "#eeeeee";
        containerHeight.style.backgroundColor = "#eeeeee";

        updateMMValues();

        return;
    }


    /* -----------------------------------------------------
       CUSTOM
    ----------------------------------------------------- */

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

        containerLength.style.backgroundColor = "#ffffff";
        containerWidth.style.backgroundColor = "#ffffff";
        containerHeight.style.backgroundColor = "#ffffff";

        updateMMValues();

        return;
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


/* Load Truck by default */

updateContainer();


/* =========================================================
   ADD PACKAGE
========================================================= */

function addPackage() {

    pkgCount++;

    const d = document.createElement("div");

    d.className = "package";


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
                    value="${colors[(pkgCount - 1) % colors.length]}"
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
       PACKAGE DIMENSION CONVERSION
       FT -> MM
    ===================================================== */

    const packageLengthInput =
        d.querySelector(".pl");

    const packageWidthInput =
        d.querySelector(".pw");

    const packageHeightInput =
        d.querySelector(".ph");


    const packageLengthMM =
        d.querySelector(".packageLengthMM");

    const packageWidthMM =
        d.querySelector(".packageWidthMM");

    const packageHeightMM =
        d.querySelector(".packageHeightMM");


    function updatePackageDimensionsMM() {

        const lengthFt =
            Number(packageLengthInput.value) || 0;

        const widthFt =
            Number(packageWidthInput.value) || 0;

        const heightFt =
            Number(packageHeightInput.value) || 0;


        packageLengthMM.textContent =
            `${feetToMM(lengthFt).toFixed(1)} mm`;


        packageWidthMM.textContent =
            `${feetToMM(widthFt).toFixed(1)} mm`;


        packageHeightMM.textContent =
            `${feetToMM(heightFt).toFixed(1)} mm`;
    }


    packageLengthInput.addEventListener(
        "input",
        updatePackageDimensionsMM
    );


    packageWidthInput.addEventListener(
        "input",
        updatePackageDimensionsMM
    );


    packageHeightInput.addEventListener(
        "input",
        updatePackageDimensionsMM
    );


    updatePackageDimensionsMM();


    /* =====================================================
       PACKAGE WEIGHT CONVERSION
       LBS -> KG
    ===================================================== */

    const weightInput =
        d.querySelector(".pweight");

    const weightKg =
        d.querySelector(".weightKg");


    function updatePackageWeightKg() {

        const lbs =
            Number(weightInput.value) || 0;

        const kg =
            lbs * 0.45359237;


        weightKg.textContent =
            `${kg.toFixed(2)} kg`;
    }


    weightInput.addEventListener(
        "input",
        updatePackageWeightKg
    );


    updatePackageWeightKg();


    /* =====================================================
       REMOVE PACKAGE
    ===================================================== */

    d.querySelector(".remove").onclick = () => {

        d.remove();

    };
}


/* =========================================================
   ADD PACKAGE BUTTON
========================================================= */

document.getElementById("add").onclick =
    addPackage;


/* First package automatically */

addPackage();


/* =========================================================
   GET NUMBER
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
        document.querySelectorAll(".package");


    const packageData =
        [...packageElements].map(

            p => ({

                name:
                    p.querySelector(".pname").value,


                length:
                    Number(
                        p.querySelector(".pl").value
                    ),


                width:
                    Number(
                        p.querySelector(".pw").value
                    ),


                height:
                    Number(
                        p.querySelector(".ph").value
                    ),


                amount:
                    Number(
                        p.querySelector(".pa").value
                    ),


                weight:
                    Number(
                        p.querySelector(".pweight").value
                    ),


                color:
                    p.querySelector(".pcolor").value,


                importance:
                    Number(
                        p.querySelector(".pimportance").value
                    ),


                auto_rotate:
                    p.querySelector(".protate").value === "true"

            })

        );


    return {

        container: {

            name:
                document.getElementById("cname").value,


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
   GENERATE PACKING
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

        data.container.name === "Conestoga" &&

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
            output.stats
        );


        render3D(
            data.container,
            output.placed
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to generate packed container."
        );
    }
};


/* =========================================================
   PACKING INFORMATION
========================================================= */

function displayStats(s) {

    const stats =
        document.getElementById(
            "stats"
        );


    stats.innerHTML = `

        <div class="packing-card">

            <h2>
                Packing Information
            </h2>


            <div class="summary-row">

                <span>
                    Packed Items:
                </span>

                <strong>
                    ${s.packed_items}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Packed Weight:
                </span>

                <strong>
                    ${Number(
                        s.packed_weight
                    ).toLocaleString()} lbs
                </strong>

            </div>


            <hr>


            <h3>
                Weight Distribution
            </h3>


            <div class="weight-row">

                <span>
                    🔵 Left Side:
                </span>

                <strong>
                    ${Number(
                        s.left_weight
                    ).toLocaleString()} lbs
                </strong>

            </div>


            <div class="weight-row">

                <span>
                    🟢 Right Side:
                </span>

                <strong>
                    ${Number(
                        s.right_weight
                    ).toLocaleString()} lbs
                </strong>

            </div>


            <div class="weight-row">

                <span>
                    🟣 Difference:
                </span>

                <strong>
                    ${Number(
                        s.weight_difference
                    ).toLocaleString()} lbs
                </strong>

            </div>


            <div class="weight-row">

                <span>
                    Balance:
                </span>

                <strong>
                    ${s.balance_percentage}%
                </strong>

            </div>


            <div class="balance-box">

                <div class="balance-title">

                    ${
                        s.balance_percentage >= 95

                            ? "✅ Well Balanced"

                            : s.balance_percentage >= 85

                            ? "⚠️ Moderately Balanced"

                            : "❌ Unbalanced"
                    }

                </div>


                <div class="balance-description">

                    ${
                        s.balance_percentage >= 95

                            ? "The difference between left and right side weights is within acceptable limits."

                            : s.balance_percentage >= 85

                            ? "The load has some imbalance between the left and right sides."

                            : "The left and right side weights are significantly unbalanced."
                    }

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   CLEAN 3D
========================================================= */

function cleanup3D() {

    if (
        animationId
    ) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }


    if (
        controls
    ) {

        controls.dispose();

        controls = null;
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


        renderer = null;
    }


    scene = null;

    camera = null;
}


/* =========================================================
   3D CONTAINER
========================================================= */

function render3D(
    container,
    boxes
) {

    const host =
        document.getElementById(
            "viewer"
        );


    cleanup3D();

    host.innerHTML = "";


    /* -----------------------------------------------------
       SCENE
    ----------------------------------------------------- */

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0xf3f6f8
        );


    /* -----------------------------------------------------
       CAMERA
    ----------------------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(

            45,

            host.clientWidth /
            host.clientHeight,

            0.1,

            10000

        );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

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


    host.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       LIGHTS
    ----------------------------------------------------- */

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

        container.length * 1.5,

        container.height * 2,

        container.width * 2

    );


    directionalLight.castShadow =
        true;


    scene.add(
        directionalLight
    );


    /* -----------------------------------------------------
       CONTAINER GEOMETRY
    ----------------------------------------------------- */

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
                0.08,

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


    /* -----------------------------------------------------
       CONTAINER EDGES
    ----------------------------------------------------- */

    const containerEdges =
        new THREE.EdgesGeometry(
            containerGeometry
        );


    const containerEdgeMaterial =
        new THREE.LineBasicMaterial({

            color:
                0x111111

        });


    const containerOutline =
        new THREE.LineSegments(

            containerEdges,

            containerEdgeMaterial

        );


    containerOutline.position.copy(
        containerMesh.position
    );


    scene.add(
        containerOutline
    );


    /* -----------------------------------------------------
       PACKED BOXES
    ----------------------------------------------------- */

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
                        0.88

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


            mesh.castShadow =
                true;


            mesh.receiveShadow =
                true;


            mesh.userData = {

                name:
                    box.name,

                index:
                    index + 1

            };


            scene.add(
                mesh
            );


            const edges =
                new THREE.EdgesGeometry(
                    geometry
                );


            const edgeMaterial =
                new THREE.LineBasicMaterial({

                    color:
                        0x222222

                });


            const outline =
                new THREE.LineSegments(

                    edges,

                    edgeMaterial

                );


            outline.position.copy(
                mesh.position
            );


            scene.add(
                outline
            );

        }

    );


    /* -----------------------------------------------------
       GRID
    ----------------------------------------------------- */

    const maxDimension =
        Math.max(

            container.length,

            container.width,

            container.height

        );


    const gridSize =
        maxDimension * 2;


    const grid =
        new THREE.GridHelper(

            gridSize,

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


    /* -----------------------------------------------------
       AXES
    ----------------------------------------------------- */

    const axesHelper =
        new THREE.AxesHelper(

            maxDimension * 0.5

        );


    scene.add(
        axesHelper
    );


    /* -----------------------------------------------------
       CAMERA POSITION
    ----------------------------------------------------- */

    const centerX =
        container.length / 2;


    const centerY =
        container.height / 2;


    const centerZ =
        container.width / 2;


    const cameraDistance =
        maxDimension * 1.15;


    camera.position.set(

        centerX +
        cameraDistance * 0.75,

        centerY +
        cameraDistance * 0.65,

        centerZ +
        cameraDistance * 0.85

    );


    camera.lookAt(

        centerX,

        centerY,

        centerZ

    );


    /* -----------------------------------------------------
       ORBIT CONTROLS
    ----------------------------------------------------- */

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


    controls.minDistance =
        maxDimension * 0.5;


    controls.maxDistance =
        maxDimension * 10;


    controls.update();


    /* -----------------------------------------------------
       ANIMATION
    ----------------------------------------------------- */

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