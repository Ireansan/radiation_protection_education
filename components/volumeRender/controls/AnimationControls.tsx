import React from "react";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import { animationStates } from "../states";

/**
 * @function AnimationControls
 * @abstract
 */
function AnimationControls() {
    const { animate } = useSnapshot(animationStates);
    const animationCofig = useControls("animation", {
        animate: {
            value: true,
            onChange: (e) => {
                animationStates.animate = e;
            },
        },
        loop: {
            value: false,
            onChange: (e) => {
                animationStates.loop = e;
            },
        },
        speed: {
            value: 0.3,
            min: 0,
            max: 2,
            render: () => animate,
            onChange: (e) => {
                animationStates.speed = e;
            },
        },
    });

    return <></>;
}

export default AnimationControls;
