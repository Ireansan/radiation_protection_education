import { proxy } from 'valtio'
import * as THREE from 'three'

class VolumeRenderStates {
    volume: any = null
    clim1: number = 0
    clim2: number = 1
    colormap: number = 0
    renderstyle: string = "iso"
    isothreshold: number = 0.15
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    up: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
}

class PlaneConfigStates {
    mode: string = "translate"
    space: string = "world"
}

const volumeRenderStates = proxy(new VolumeRenderStates());
const planeConfigStates = proxy(new PlaneConfigStates());

export {volumeRenderStates, planeConfigStates}