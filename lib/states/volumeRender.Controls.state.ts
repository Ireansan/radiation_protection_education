import { proxy } from "valtio";
import * as THREE from "three";

/** */
class TransformConfigStates {
    mode: string = "translate";
    space: string = "world";
}
const transformConfigStates = proxy(new TransformConfigStates());

/** */
class ClippingPlaneData {
    position: THREE.Vector3 = new THREE.Vector3();
    rotation: THREE.Euler = new THREE.Euler();
}
class TypeConfigStates {
    configType: string = "type 1";
    controlsStates: ClippingPlaneData = new ClippingPlaneData();
    transfromControlsStates: ClippingPlaneData = new ClippingPlaneData();
}
const typeConfigStates = proxy(new TypeConfigStates());

export { transformConfigStates, typeConfigStates };
