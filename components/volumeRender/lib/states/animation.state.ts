import { proxy } from "valtio";

class AnimationStates {
    animate: boolean = true;
    loop: boolean = false;
    speed: number = 0.1;
    i: number = 0;
}
const animationStates = proxy(new AnimationStates());

export {animationStates};