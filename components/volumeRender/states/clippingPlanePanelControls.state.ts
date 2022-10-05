import { proxy } from "valtio";
import * as THREE from "three";

class ClippingPlanePanelControlsStates {
    position: THREE.Vector3 = new THREE.Vector3();
    rotation: THREE.Euler = new THREE.Euler();
}
const clippingPlanePanelControlsStates = proxy(new ClippingPlanePanelControlsStates());

export { clippingPlanePanelControlsStates };