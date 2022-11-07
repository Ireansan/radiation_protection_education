import * as THREE from "three";
import React, { Suspense } from "react";

import * as Models from "../models";
import { AnimationGroup } from "../volumeRender";

export function XRayRoomAnimation({ ...props }) {
    return (
        <>
            <Suspense fallback={null}>
                <AnimationGroup {...props}>
                    <Models.Dose_1 />
                    <Models.Dose_2 />
                    <Models.Dose_3 />
                    <Models.Dose_4 />
                    <Models.Dose_5 />
                    <Models.Dose_6 />
                    <Models.Dose_7 />
                    <Models.Dose_8 />
                    <Models.Dose_9 />
                    <Models.Dose_10 />
                    <Models.Dose_11 />
                    <Models.Dose_12 />
                    <Models.Dose_13 />
                    <Models.Dose_14 />
                    <Models.Dose_15 />
                    <Models.Dose_16 />
                </AnimationGroup>
            </Suspense>
        </>
    );
}
