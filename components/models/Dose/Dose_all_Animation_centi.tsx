import * as THREE from "three";
import React from "react";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

import * as DOSE_ALL from "./Dose_all";
import { VolumeAnimationObject } from "../../../src";
extend({ VolumeAnimationObject });

export function Dose_all_Animation_centi({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    return (
        <>
            <DOSE_ALL.Dose_all_1 coefficient={0.01} />
            <DOSE_ALL.Dose_all_2 coefficient={0.01} />
            <DOSE_ALL.Dose_all_3 coefficient={0.01} />
            <DOSE_ALL.Dose_all_4 coefficient={0.01} />
            <DOSE_ALL.Dose_all_5 coefficient={0.01} />
            <DOSE_ALL.Dose_all_6 coefficient={0.01} />
            <DOSE_ALL.Dose_all_7 coefficient={0.01} />
            <DOSE_ALL.Dose_all_8 coefficient={0.01} />
            <DOSE_ALL.Dose_all_9 coefficient={0.01} />
            <DOSE_ALL.Dose_all_10 coefficient={0.01} />
            <DOSE_ALL.Dose_all_11 coefficient={0.01} />
            <DOSE_ALL.Dose_all_12 coefficient={0.01} />
            <DOSE_ALL.Dose_all_13 coefficient={0.01} />
            <DOSE_ALL.Dose_all_14 coefficient={0.01} />
            <DOSE_ALL.Dose_all_15 coefficient={0.01} />
            <DOSE_ALL.Dose_all_16 coefficient={0.01} />
        </>
    );
}
