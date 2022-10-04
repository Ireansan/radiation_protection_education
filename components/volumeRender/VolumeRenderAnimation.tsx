import React, { Children, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { animationStates } from "./lib/states";

/**
 * @function VolumeRenderAnimation
 * @param children
 */
function VolumeRenderAnimation({ ...children }) {
    const { animate, loop, speed, i } = useSnapshot(animationStates);

    const lenChildren = Children.count(children);

    const { clock } = useThree();
    const tmpTime = useRef<number>(clock.elapsedTime);

    useFrame(({ clock }) => {
        const time: number = clock.elapsedTime * speed;

        if (animate) {
            if (loop) {
                animationStates.i = Math.floor(time % lenChildren);
            } else if (speed * (clock.elapsedTime - tmpTime.current) >= 1) {
                animationStates.i += 1;

                if (i >= lenChildren) {
                    animationStates.i = 0;
                }

                tmpTime.current = clock.elapsedTime;
            }
        }
    });

    return <>{children[i]}</>;
}

export default VolumeRenderAnimation;
