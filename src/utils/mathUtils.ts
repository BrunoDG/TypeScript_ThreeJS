import * as THREE from "three";

export class Utils {
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  static map(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
  ): number {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }

  static getBox(
    geometry: THREE.BoxBufferGeometry,
    material: THREE.MeshLambertMaterial,
    count: number
  ): THREE.InstancedMesh {
    const mesh: THREE.InstancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      count
    );
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  static addFloor(scene: THREE.Scene): void {
    const planeGeometry: THREE.PlaneBufferGeometry =
      new THREE.PlaneBufferGeometry(500, 500);
    const planeMaterial: THREE.ShadowMaterial = new THREE.ShadowMaterial({
      opacity: 0.35,
    });

    let floor: THREE.Mesh = new THREE.Mesh(planeGeometry, planeMaterial);

    planeGeometry.rotateX(-Math.PI / 2);
    floor.position.y = 2;
    floor.receiveShadow = true;

    scene.add(floor);
  }
}
