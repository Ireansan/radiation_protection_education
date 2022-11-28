import * as THREE from "three";
import React from "react";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

import * as DOSE_ALL from "./Dose_all";
import {
    VolumeAnimationObject,
    VolumeAnimationGroup,
} from "../../volumeRender";
extend({ VolumeAnimationObject });

export function Dose_all_Animation({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <VolumeAnimationGroup {...props}>
                <DOSE_ALL.Dose_all_1 />
                <DOSE_ALL.Dose_all_2 />
                <DOSE_ALL.Dose_all_3 />
                <DOSE_ALL.Dose_all_4 />
                <DOSE_ALL.Dose_all_5 />
                <DOSE_ALL.Dose_all_6 />
                <DOSE_ALL.Dose_all_7 />
                <DOSE_ALL.Dose_all_8 />
                <DOSE_ALL.Dose_all_9 />
                <DOSE_ALL.Dose_all_10 />
                <DOSE_ALL.Dose_all_11 />
                <DOSE_ALL.Dose_all_12 />
                <DOSE_ALL.Dose_all_13 />
                <DOSE_ALL.Dose_all_14 />
                <DOSE_ALL.Dose_all_15 />
                <DOSE_ALL.Dose_all_16 />
            </VolumeAnimationGroup>
        </>
    );
}
