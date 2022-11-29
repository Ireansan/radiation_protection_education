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
export type VolumeObjectProps = ReactThreeFiber.Object3DNode<
    VolumeObject,
    typeof VolumeObject
>;
export type VolumeGroupProps = ReactThreeFiber.Object3DNode<
    VolumeGroup,
    typeof VolumeGroup
>;

declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeAnimationObject: VolumeAnimationObjectProps;
        volumeObject: VolumeObjectProps;
        volumeGroup: VolumeGroupProps;
    }
}
