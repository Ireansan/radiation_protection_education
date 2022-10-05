import React, { Children, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { VolumeRenderObject } from "./lib/core";
import {
    volumeStates,
    clippingPlaneStore,
    animationStates,
} from "./lib/states";

/**
 * @function VolumeRenderAnimation
 * @param children
 */
type VolumeRenderAnimationArg = {
    volumes: any[];
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    cmtextures: THREE.Texture[];
    clipping?: boolean;
};
function VolumeRenderAnimation({
    volumes,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    cmtextures,
    clipping = false,
    ...props
}: VolumeRenderAnimationArg) {
    const { clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volumeStates);
    const { animate, loop, speed, i } = useSnapshot(animationStates);

    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

    const lenChildren = Children.count(volumes);

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

    return (
        <>
            <VolumeRenderObject
                position={position}
                rotation={rotation}
                scale={scale}
                volume={volumes[i]}
                cmtextures={cmtextures}
                clim1={clim1}
                clim2={clim2}
                colormap={colormap}
                renderstyle={renderstyle}
                isothreshold={isothreshold}
                plane={plane}
                {...props}
            />
        </>
    );
}

export default VolumeRenderAnimation;
