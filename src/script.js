import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */

// creatig a parameters object that will contain all the parameters of our galaxy
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;

let geometry = null;
let material = null;
let points = null;

// creating a generateGalaxy function for creating galaxy

const generateGalaxy = () => {
  // Before assigning these variables, we can test if they already exist and use the dispose(...) method
  // to destroy the geometry and the material properly.
  // Then remove the points from the scene with remove()

  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // ######## Geometry ########
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 3;
    positions[i3 + 1] = (Math.random() - 0.5) * 3;
    positions[i3 + 2] = (Math.random() - 0.5) * 3;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // ######## Material ########

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // ######## Create Points #######

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

/**
 * Adding GUI controls
 */

// gui.add(parameters, "count").min(100).max(100000).step(100);
// gui.add(parameters, "size").min(0.001).max(0.1).step(0.001);

// To generate the galaxy again when we change the value in GUI, we must listen to the change event
// Use the finishChange(..) method and provide the generateGalaxy function

// right now we are creating new galxay but not destroying or deleting the old ones, this will create crash of system

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
