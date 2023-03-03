import React from "react";
import { VolumeObject, VolumeGroup } from "../core";

export type VolumeControlsTypes = JSX.IntrinsicElements["volumeGroup"] & {
    children?: React.ReactElement<VolumeObject | VolumeGroup>;
    object?:
        | VolumeObject
        | VolumeGroup
        | React.RefObject<VolumeObject>
        | React.RefObject<VolumeGroup>;
};
