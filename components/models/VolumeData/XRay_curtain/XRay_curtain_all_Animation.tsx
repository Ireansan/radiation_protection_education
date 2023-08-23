import React from "react";
import { extend } from "@react-three/fiber";

import * as XRAY_CURTAIN_ALL from "./XRay_curtain_all";
import { VolumeAnimationObject } from "../../../../src";
extend({ VolumeAnimationObject });

export function XRay_curtain_all_Animation({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <XRAY_CURTAIN_ALL.XRay_curtain_all_1 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_2 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_3 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_4 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_5 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_6 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_7 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_8 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_9 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_10 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_11 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_12 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_13 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_14 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_15 />
            <XRAY_CURTAIN_ALL.XRay_curtain_all_16 />
        </>
    );
}
