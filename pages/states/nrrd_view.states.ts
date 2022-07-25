import { proxy } from 'valtio'
import * as THREE from 'three'

class volumeStates {
    clim1: number = 0
    clim2: number = 1
    // colormap: string = "viridis"
    colormap: number = 0
    renderstyle: string = "iso"
    isothreshold: number = 0.15
}

export const volstate = proxy(new volumeStates());