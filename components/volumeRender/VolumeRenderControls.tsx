import React from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    VolumeControls,
    ClippingPlaneControls,
    AnimationControls,
} from "./lib/controls";

/**
 * @function VolumeRenderControls
 * @param clipping?: boolean, Default false
 * @param animation?: boolean, Default false
 */
type volumeRenderControlsArgs = {
    clipping?: boolean;
    animation?: boolean;
};
function VolumeRenderControls({
    clipping = false,
    animation = false,
}: volumeRenderControlsArgs) {
    return (
        <>
            <VolumeControls />
            {clipping && <ClippingPlaneControls />}
            {animation && <AnimationControls />}
        </>
    );
}

export default VolumeRenderControls;
