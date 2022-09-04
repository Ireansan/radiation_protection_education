import { proxy } from "valtio";

class VolumeRenderStates {
    volume: any = null;
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
}
const volumeRenderStates = proxy(new VolumeRenderStates());

export default volumeRenderStates;
