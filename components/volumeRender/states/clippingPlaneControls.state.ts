import { proxy } from "valtio";

class ClippingPlaneControlsStates {
    type: string = "type 1"
}
const clippingPlaneControlsStates = proxy(new ClippingPlaneControlsStates());

export {clippingPlaneControlsStates};