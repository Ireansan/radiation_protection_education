import { proxy } from "valtio";
import * as THREE from "three";

import {Volume} from "three/examples/jsm/misc/Volume";

class VolumeRenderStates {
    modelPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    modelRotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    volume: Volume = new Volume();
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
}
const volumeRenderStates = proxy(new VolumeRenderStates());

export default volumeRenderStates;
