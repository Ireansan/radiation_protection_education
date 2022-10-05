import { proxy } from "valtio";
import * as THREE from "three";

class ClippingPlaneTransformControlsStates {
    mode: string = "translate";
    space: string = "world";
    position: THREE.Vector3 = new THREE.Vector3();
    rotation: THREE.Euler = new THREE.Euler();
}
const clippingPlaneTransformControlsStates = proxy(new ClippingPlaneTransformControlsStates());

export { clippingPlaneTransformControlsStates };
