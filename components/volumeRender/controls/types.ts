import React from "react";
import { VolumeBase } from "../../../src";

export type Target = {
    object: THREE.Object3D | undefined;
    id: number;
};

export type VolumeControlsTypes = JSX.IntrinsicElements["volumeGroup"] & {
    children?: React.ReactElement<VolumeBase>;
    object?: VolumeBase | React.RefObject<VolumeBase>;
};
