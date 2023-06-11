import React from "react";
import { extend } from "@react-three/fiber";

import * as DOSE_CURTAIN_ALL from "./Dose_curtain_all";
import { VolumeAnimationObject } from "../../../src";
extend({ VolumeAnimationObject });

export function Dose_curtain_all_Animation_centi({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <DOSE_CURTAIN_ALL.Dose_curtain_all_1 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_2 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_3 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_4 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_5 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_6 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_7 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_8 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_9 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_10 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_11 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_12 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_13 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_14 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_15 coefficient={0.01} />
            <DOSE_CURTAIN_ALL.Dose_curtain_all_16 coefficient={0.01} />
        </>
    );
}
