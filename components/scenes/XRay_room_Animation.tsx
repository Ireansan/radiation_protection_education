import * as THREE from "three";
import React, { Suspense } from "react";

import * as Models from "../models";
import { AnimationGroup } from "../volumeRender";

export function XRayRoomAnimation({ ...props }) {
    const rotation: THREE.Vector3Tuple = [0, Math.PI / 2, 0];

    return (
        <>
            {console.log(props)}
            <Suspense fallback={null}>
                <AnimationGroup {...props}>
                    <Models.Dose_1 rotation={rotation} />
                    <Models.Dose_2 rotation={rotation} />
                    <Models.Dose_3 rotation={rotation} />
                    <Models.Dose_4 rotation={rotation} />
                    <Models.Dose_5 rotation={rotation} />
                    <Models.Dose_6 rotation={rotation} />
                    <Models.Dose_7 rotation={rotation} />
                    <Models.Dose_8 rotation={rotation} />
                    <Models.Dose_9 rotation={rotation} />
                    <Models.Dose_10 rotation={rotation} />
                    <Models.Dose_11 rotation={rotation} />
                    <Models.Dose_12 rotation={rotation} />
                    <Models.Dose_13 rotation={rotation} />
                    <Models.Dose_14 rotation={rotation} />
                    <Models.Dose_15 rotation={rotation} />
                    <Models.Dose_16 rotation={rotation} />
                </AnimationGroup>
            </Suspense>
        </>
    );
}
