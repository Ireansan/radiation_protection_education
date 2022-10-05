import { proxy } from "valtio";
import * as THREE from "three";

import {Volume} from "three/examples/jsm/misc/Volume";

class VolumeStates {
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
    volume: Volume = new Volume();
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
}
const volumeStates = proxy(new VolumeStates());

export { volumeStates };
