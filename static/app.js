import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let pkgCount = 0;
const packages = document.getElementById("packages");

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let animationId = null;

/* ---------------------------------------------------
   CONTAINER TYPE SELECTION
--------------------------------------------------- */

const containerName = document.getElementById("cname");
const containerLength = document.getElementById("cl");
const containerWidth = document.getElementById("cw");
const containerHeight = document.getElementById("ch");

const lengthMM = document.getElementById("lengthMM");
const widthMM = document.getElementById("widthMM");
const heightMM = document.getElementById("heightMM");



function feetToMM(feet) {
    return Math.round(feet * 304.8);
}


function updateMMValues() {

    const l = Number(containerLength.value);
    const w = Number(containerWidth.value);
    const h = Number(containerHeight.value);

    lengthMM.textContent =
        l ? `${feetToMM(l)} mm` : "";

    widthMM.textContent =
        w ? `${feetToMM(w)} mm` : "";

    heightMM.textContent =
        h ? `${feetToMM(h)} mm` : "";
}


function updateContainer() {

    const selected = containerName.value;


    /* =========================================
       TRUCK
    ========================================= */

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


    /* =========================================
       CONESTOGA
    ========================================= */

    if (selected === "Conestoga") {

        // Length is adjustable from 48 ft to 53 ft
        containerLength.value = 48;

        containerLength.min = 48;
        containerLength.max = 53;

        containerLength.readOnly = false;


        // Fixed width
        containerWidth.value = 8.6;
        containerWidth.readOnly = true;


        // Fixed height
        containerHeight.value = 6.6;
        containerHeight.readOnly = true;


        containerLength.style.backgroundColor = "#ffffff";
        containerWidth.style.backgroundColor = "#eeeeee";
        containerHeight.style.backgroundColor = "#eeeeee";

        

        updateMMValues();

        return;
    }


    /* =========================================
       CUSTOM
    ========================================= */

    if (selected === "Custom") {

        // Clear preset dimensions
        containerLength.value = "";
        containerWidth.value = "";
        containerHeight.value = "";

        // User can enter ALL dimensions
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


/* ---------------------------------------------------
   LISTEN FOR DROPDOWN CHANGE
--------------------------------------------------- */

containerName.addEventListener(
    "change",
    updateContainer
);


/* ---------------------------------------------------
   UPDATE MM WHILE USER TYPES
--------------------------------------------------- */

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


/* ---------------------------------------------------
   LOAD TRUCK BY DEFAULT
--------------------------------------------------- */

updateContainer();

/* ---------------------------------------------------
   ADD PACKAGE
--------------------------------------------------- */

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
                Length
                <input
                    class="pl"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >
            </label>

            <label>
                Width
                <input
                    class="pw"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >
            </label>

            <label>
                Height
                <input
                    class="ph"
                    type="number"
                    value="2"
                    min="0.1"
                    step="0.1"
                >
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
                Weight
                <input
                    class="pweight"
                    type="number"
                    value="1"
                    min="0"
                    step="0.1"
                >
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
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </label>

            <label>
                &nbsp;
                <button class="remove">
                    Remove
                </button>
            </label>
        </div>
    `;

    d.querySelector(".remove").onclick = () => {
        d.remove();
    };

    packages.appendChild(d);
}

document.getElementById("add").onclick = addPackage;

addPackage();

/* ---------------------------------------------------
   GET NUMBER FROM INPUT
--------------------------------------------------- */

function getNumber(id) {
    return Number(
        document.getElementById(id).value
    );
}

/* ---------------------------------------------------
   COLLECT ALL FORM DATA
--------------------------------------------------- */

function collect() {

    const packageElements =
        document.querySelectorAll(".package");

    const packageData =
        [...packageElements].map(p => ({

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
                    p.querySelector(
                        ".pimportance"
                    ).value
                ),

            auto_rotate:
                p.querySelector(
                    ".protate"
                ).value === "true"
        }));

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

/* ---------------------------------------------------
   GENERATE PACKED CONTAINER
--------------------------------------------------- */

document.getElementById(
    "generate"
).onclick = async () => {

    const data = collect();

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

    if (data.packages.length === 0) {
        alert(
            "Please add at least one package."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "/api/pack",
                {
                    method: "POST",

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

        if (output.error) {
            alert(output.error);
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
            "Unable to generate packed container. Check the browser console for details."
        );
    }
};

/* ---------------------------------------------------
   DISPLAY PACKING INFORMATION
--------------------------------------------------- */

function displayStats(s) {

    const stats =
        document.getElementById("stats");

    stats.innerHTML = `

        <b>Space Utilization:</b>
        ${s.space_utilization}%<br>

        <b>Used Volume:</b>
        ${s.used_volume}<br>

        <b>Residual Volume:</b>
        ${s.residual_volume}<br>

        <b>Unpacked Volume:</b>
        ${s.unpacked_volume}<br>

        <b>Packed Items:</b>
        ${s.packed_items}<br>

        <b>Unpacked Items:</b>
        ${s.unpacked_items}<br>

        <b>Packed Weight:</b>
        ${s.packed_weight}
    `;
}

/* ---------------------------------------------------
   CLEAN OLD 3D SCENE
--------------------------------------------------- */

function cleanup3D() {

    if (animationId) {
        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }

    if (controls) {
        controls.dispose();
        controls = null;
    }

    if (renderer) {

        renderer.dispose();

        renderer.domElement.remove();

        renderer = null;
    }

    scene = null;
    camera = null;
}

/* ---------------------------------------------------
   CREATE 3D CONTAINER
--------------------------------------------------- */

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

    /* -----------------------------------------------
       SCENE
    ----------------------------------------------- */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0xf3f6f8
        );

    /* -----------------------------------------------
       CAMERA
    ----------------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(

            45,

            host.clientWidth /
            host.clientHeight,

            0.1,

            10000
        );

    /* -----------------------------------------------
       RENDERER
    ----------------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
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

    /* -----------------------------------------------
       LIGHTS
    ----------------------------------------------- */

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

    /* -----------------------------------------------
       CONTAINER DIMENSIONS
    ----------------------------------------------- */

    const containerGeometry =
        new THREE.BoxGeometry(

            container.length,

            container.height,

            container.width
        );

    /* -----------------------------------------------
       TRANSPARENT CONTAINER
    ----------------------------------------------- */

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

    /* -----------------------------------------------
       CONTAINER BORDER
    ----------------------------------------------- */

    const containerEdges =
        new THREE.EdgesGeometry(
            containerGeometry
        );

    const containerEdgeMaterial =
        new THREE.LineBasicMaterial({
            color: 0x111111
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

    /* -----------------------------------------------
       ADD PACKED BOXES
    ----------------------------------------------- */

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

            /* BOX OUTLINE */

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

    /* -----------------------------------------------
       FLOOR GRID
    ----------------------------------------------- */

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

    /* -----------------------------------------------
       AXES HELPER
    ----------------------------------------------- */

    const axesHelper =
        new THREE.AxesHelper(
            maxDimension * 0.5
        );

    scene.add(
        axesHelper
    );

    /* -----------------------------------------------
       CAMERA POSITION
    ----------------------------------------------- */

    const centerX =
        container.length / 2;

    const centerY =
        container.height / 2;

    const centerZ =
        container.width / 2;

    const distance =
        maxDimension * 2.3;

    camera.position.set(

        centerX + distance,

        centerY + distance * 0.7,

        centerZ + distance
    );

    camera.lookAt(

        centerX,

        centerY,

        centerZ
    );

    /* -----------------------------------------------
       ORBIT CONTROLS
    ----------------------------------------------- */

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

    /* -----------------------------------------------
       ANIMATION
    ----------------------------------------------- */

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

/* ---------------------------------------------------
   HANDLE WINDOW RESIZE
--------------------------------------------------- */

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