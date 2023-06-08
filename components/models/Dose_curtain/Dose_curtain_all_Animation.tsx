import React from "react";
import { extend } from "@react-three/fiber";

import * as DOSE_CURTAIN_ALL from "./Dose_curtain_all";
import { VolumeAnimationObject } from "../../../src";
extend({ VolumeAnimationObject });

export function Dose_curtain_all_Animation({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <DOSE_CURTAIN_ALL.Dose_curtain_all_1 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_2 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_3 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_4 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_5 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_6 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_7 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_8 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_9 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_10 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_11 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_12 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_13 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_14 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_15 />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_16 />
        </>
    );
}
