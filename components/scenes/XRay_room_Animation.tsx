import * as THREE from "three";
import React, { Suspense } from "react";

import * as Models from "../models";
import { AnimationGroup } from "../volumeRender";

export function XRayRoomAnimation({ ...props }) {
    return (
        <>
            <Suspense fallback={null}>
                <AnimationGroup {...props}>
                    <Models.Dose_all_1 />
                    <Models.Dose_all_2 />
                    <Models.Dose_all_3 />
                    <Models.Dose_all_4 />
                    <Models.Dose_all_5 />
                    <Models.Dose_all_6 />
                    <Models.Dose_all_7 />
                    <Models.Dose_all_8 />
                    <Models.Dose_all_9 />
                    <Models.Dose_all_10 />
                    <Models.Dose_all_11 />
                    <Models.Dose_all_12 />
                    <Models.Dose_all_13 />
                    <Models.Dose_all_14 />
                    <Models.Dose_all_15 />
                    <Models.Dose_all_16 />
                </AnimationGroup>
            </Suspense>
        </>
    );
}
