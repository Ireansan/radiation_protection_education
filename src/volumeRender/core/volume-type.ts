import React from "react";
import { extend, ReactThreeFiber } from "@react-three/fiber";

import { VolumeAnimationObject } from "./volumeAnimationObject";
import { VolumeGroup } from "./volumeGroup";
import { VolumeObject } from "./volumeObject";
extend({ VolumeAnimationObject, VolumeGroup, VolumeObject });

export type VolumeAnimationObjectProps = ReactThreeFiber.Object3DNode<
    VolumeAnimationObject,
    typeof VolumeAnimationObject
>;
export type VolumeGroupProps = ReactThreeFiber.Object3DNode<
    VolumeGroup,
    typeof VolumeGroup
>;
export type VolumeObjectProps = ReactThreeFiber.Object3DNode<
    VolumeObject,
    typeof VolumeObject
>;

/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/4121b109a71dd266ea6bdef8b4e0a2970b1a40de/packages/fiber/src/three-types.ts
 */
declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeAnimationObject: VolumeAnimationObjectProps;
        volumeGroup: VolumeGroupProps;
        volumeObject: VolumeObjectProps;
    }
}
