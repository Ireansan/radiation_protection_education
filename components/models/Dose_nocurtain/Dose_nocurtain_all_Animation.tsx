import React from "react";
import { extend } from "@react-three/fiber";

import * as DOSE_NOCURTAIN_ALL from "./Dose_nocurtain_all";
import { VolumeAnimationObject } from "../../../src";
extend({ VolumeAnimationObject });

export function Dose_nocurtain_all_Animation({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_1 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_2 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_3 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_4 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_5 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_6 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_7 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_8 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_9 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_10 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_11 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_12 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_13 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_14 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_15 />
            <DOSE_NOCURTAIN_ALL.Dose_nocurtain_all_16 />
        </>
    );
}
