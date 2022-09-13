import { proxy } from "valtio";

import {Volume} from "../jsm/misc/Volume"

class VolumeRenderStates {
    volume: Volume = new Volume();
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
}
const volumeRenderStates = proxy(new VolumeRenderStates());

export default volumeRenderStates;
