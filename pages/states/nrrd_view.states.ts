import { proxy } from "valtio";
import * as THREE from "three";
import type { Object3D as TypeObject3D } from "three";

class VolumeRenderStates {
    volume: any = null;
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    up: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    plane: TypeObject3D = new THREE.Object3D();
}

class PlaneConfigStates {
    mode: string = "translate";
    space: string = "world";
}

const volumeRenderStates = proxy(new VolumeRenderStates());
const planeConfigStates = proxy(new PlaneConfigStates());

export { volumeRenderStates, planeConfigStates };
