import React from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";

import {
    VolumeAnimationObject,
    VolumeObject,
    VolumeGroup,
    Dosimeter as DosimeterImpl,
    VolumeBase,
} from "../../../src";
extend({ VolumeObject, VolumeGroup });

/**
 *
 */
type DosimeterControlsProps = {
    children?: React.ReactElement<VolumeObject | VolumeGroup>;
    object: React.RefObject<THREE.Object3D>;
    names: string[];
    targets: React.RefObject<VolumeBase>[];
};
export const DosimeterControls = React.forwardRef<
    DosimeterImpl,
    DosimeterControlsProps
>(function DosimeterControls(
    { children, object, targets, names = [], ...props },
    ref
) {
    const controls = React.useMemo(() => new DosimeterImpl(), []);
    const group = React.useRef<THREE.Group>(null);

    // Init
    React.useEffect(() => {
        if (object.current) {
            controls.attach(object.current);
        } else if (group.current) {
            controls.attach(group.current);
        }

        return () => {
            controls.detach();
        };
    }, [object, children, controls]);

    React.useEffect(() => {
        controls.names = names;

        return () => {
            controls.names = undefined;
        };
    }, [names, controls]);

    React.useEffect(() => {
        let targetsArray: VolumeBase[] = [];
        for (let i = 0; i < targets.length; i++) {
            let tmp = targets[i].current;
            if (tmp) {
                targetsArray.push(tmp);
            }
        }

        controls.attachTargets(targetsArray);

        return () => {
            controls.detachTargets();
        };
    }, [targets, controls]);

    useFrame(() => {
        controls.updateResults();
    });

    return (
        <>
            <primitive ref={ref} object={controls} />
            <group ref={group}>{children}</group>
        </>
    );
});
