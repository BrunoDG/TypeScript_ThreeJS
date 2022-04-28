import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

/**
 * Perspective camera with fov, aspect, near, far
 */
const camera1 = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
camera1.position.z = 2;

/**
 * Orthographic cameras with left, right, top, bottom, near, far
 * Camera 2 is the top view;
 * Camera 3 is the side view;
 * Camera 4 is the front view;
 */
const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera2.position.y = 1;
camera2.lookAt(new THREE.Vector3(0, 0, 0));

const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera3.position.z = 1;

const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera4.position.x = 1;
camera4.lookAt(new THREE.Vector3(0, 0, 0));

/**
 * Canvas and renderer for the Perspective Camera
 */

const canvas1 = document.getElementById("c1") as HTMLCanvasElement;
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
renderer1.setSize(200, 200);

/**
 * Canvases and renderers for the Orthographic Cameras
 */
const canvas2 = document.getElementById("c2") as HTMLCanvasElement;
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
renderer2.setSize(200, 200);

const canvas3 = document.getElementById("c3") as HTMLCanvasElement;
const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 });
renderer3.setSize(200, 200);

const canvas4 = document.getElementById("c4") as HTMLCanvasElement;
const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 });
renderer4.setSize(200, 200);

new OrbitControls(camera1, renderer1.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

console.dir(scene);

/**
 * This function is used to resize the canvas when the window is resized.
 * Since we're not using resize on this example, this function will remain
 * empty for the time being.
 */

/*
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera1.aspect = window.innerWidth / window.innerHeight;
  camera1.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
*/

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  render();
}

function render() {
  renderer1.render(scene, camera1);
  renderer2.render(scene, camera2);
  renderer3.render(scene, camera3);
  renderer4.render(scene, camera4);
}

animate();
