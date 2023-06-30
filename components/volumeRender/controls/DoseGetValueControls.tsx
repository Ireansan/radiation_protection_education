import React from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";

import {
    VolumeObject,
    VolumeGroup,
    Dosimeter as DosimeterImpl,
} from "../../../src";
extend({ VolumeObject, VolumeGroup });

/**
 *
 */
type DosimeterControlsProps = {
    object: React.MutableRefObject<THREE.Object3D>;
    names: string[];
    targets: React.MutableRefObject<VolumeObject>[];
};
export const DosimeterControls = React.forwardRef<
    DosimeterControlsProps,
    DosimeterControlsProps
>(function DosimeterControls({ object, targets, names = [], ...props }, ref) {
    const controls = React.useMemo(() => new DosimeterImpl(), []);

    // Init
    React.useLayoutEffect(() => {
        let targetsArray = targets.map((target) => target.current);
        if (object.current) {
            controls.attach(object.current);
            controls.names = names;
            controls.attachTargets(targetsArray);
        }

        return () => {
            controls.detach();
            controls.detachTargets();
        };
    }, [object, names, targets, controls]);

    useFrame(() => {
        controls.updateResults();
    });

    return (
        <>
            <primitive ref={ref} object={controls} />
        </>
    );
});
