import * as THREE from "three";
import { Mesh } from "three";
import { Utils } from "../utils/mathUtils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

//const backgroundColor = 0x000000;
const ambientLightColor = 0xed1a21;
const spotLightColor = 0xed1a21;
const boxColor = 0x303030;
const gridSize = 300;

let angle = 30;
let col: number = gridSize;
let row: number = gridSize;
let velocity: number = 0.1;
let boxes: THREE.Object3D<THREE.Event>[][] = [];
let amplitude: number = -1;
let frequency: number = 0;
let waveLength: number = 242;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", render);

const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
scene.add(cube);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function startProgram(): void {
  addAmbientLight();
  addDirectionalLight();
  Utils.addFloor(scene);
  addBoxes(scene);
  render();
  window.addEventListener("resize", onWindowResize, false);
}

function animate(): void {
  requestAnimationFrame(animate);

  render();
}

function render(): void {
  renderer.render(scene, camera);
}

function addSpotLight() {
  let spotLight: THREE.SpotLight = new THREE.SpotLight(spotLightColor);
  spotLight.position.set(100, 250, 150);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function addAmbientLight(): void {
  const light: THREE.AmbientLight = new THREE.AmbientLight(
    ambientLightColor,
    0.5
  );
  scene.add(light);
}

function addDirectionalLight(): void {
  let directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
    0xed1a21
  );
  directionalLight.castShadow = true;
  directionalLight.position.set(0, 1, 0);

  directionalLight.shadow.camera = new THREE.OrthographicCamera(
    -40,
    40,
    20,
    -20,
    -100,
    1000
  );

  directionalLight.shadow.camera.zoom = 1;

  const targetObject = new THREE.Object3D();
  targetObject.position.set(-50, -82, 40);
  directionalLight.target = targetObject;

  scene.add(directionalLight);
  scene.add(directionalLight.target);
}

function addBoxes(scene: THREE.Scene): void {
  const size: number = 1;
  const height: number = 5;
  const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    color: boxColor,
  });

  const geometry: THREE.BoxBufferGeometry = new THREE.BoxBufferGeometry(
    size,
    height,
    size
  );
  geometry.translate(0, 2.5, 0);
  const mesh: THREE.InstancedMesh = Utils.getBox(geometry, material, row * col);
  scene.add(mesh);

  let n: number = 0;

  for (let i: number = 0; i < col; i++) {
    boxes[i] = [];

    for (let j: number = 0; j < row; j++) {
      const pivot: THREE.Object3D = new THREE.Object3D();
      boxes[i][j] = pivot;

      pivot.scale.set(1, 0.001, 1);
      pivot.position.set(i - gridSize * 0.5, height * 0.5, j - gridSize * 0.5);

      pivot.updateMatrix();
      mesh.setMatrixAt(n++, pivot.matrix);
    }
  }

  mesh.instanceMatrix.needsUpdate = true;
}

function drawWave(this: any): void {
  let n: number = 0;

  for (let i: number = 0; i < col; i++) {
    for (let j: number = 0; j < row; j++) {
      const dist: number = Utils.distance(j, i, row * 0.5, col * 0.5);

      const offset: number = Utils.map(dist, 0, waveLength, -100, 100);
      const ang: number = angle + offset;

      boxes[i][j].scale.y = Utils.map(Math.sin(ang), -1, -amplitude, 0.001, 1);
      this.mesh.setMatrix(n++, boxes[i][j].matrix);
    }
  }
  this.mesh.instanceMatrix.needsUpdate = true;
  angle -= velocity;
}

function addGrid() {
  const size: number = col;
  const divisions: number = size;
  const gridHelper: THREE.GridHelper = new THREE.GridHelper(size, divisions);

  gridHelper.position.set(0, 0, 0);

  scene.add(gridHelper);
}

function clearScene(this: any, scene: THREE.Scene): void {
  scene.remove(this.mesh);
  boxes = [];
}

startProgram();
