import React, { Children, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { animationStates } from "./states";

type volumeRenderAnimationProps = {
    children: React.ReactNode;
};
/**
 * @function VolumeRenderAnimation
 * @param children
 */
function VolumeRenderAnimation({
    children,
    ...props
}: volumeRenderAnimationProps) {
    const { animate, loop, speed, i } = useSnapshot(animationStates);

    const childrenLength = Children.count(children);
    const childrenArray = Children.toArray(children);

    const { clock } = useThree();
    const tmpTime = useRef<number>(clock.elapsedTime);

    useFrame(({ clock }) => {
        const time: number = clock.elapsedTime * speed;

        if (animate) {
            if (loop) {
                animationStates.i = Math.floor(time % childrenLength);
            } else if (speed * (clock.elapsedTime - tmpTime.current) >= 1) {
                animationStates.i += 1;

                if (i >= childrenLength) {
                    animationStates.i = 0;
                }

                tmpTime.current = clock.elapsedTime;
            }
        }
    });

    return <>{childrenArray[i]}</>;
}

export default VolumeRenderAnimation;
