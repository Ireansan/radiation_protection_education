import React from "react";
import * as THREE from "three";
import { extend, useThree } from "@react-three/fiber";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../../src";
extend({ VolumeObject, VolumeGroup });

type Target = {
    object: THREE.Object3D | undefined;
    id: number;
};

/**
 *
 */
type volumeGetValueControlsProps = {
    object?:
        | React.MutableRefObject<VolumeObject>
        | React.MutableRefObject<VolumeGroup>;
    targets: string[];
};
export function VolumeGetValueControls(
    object: React.RefObject<VolumeObject> | React.RefObject<VolumeGroup>,
    targets: string[]
) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);

    const { scene } = useThree();

    // Init
    React.useLayoutEffect(() => {
        if (object.current) {
            controls.attach(object.current);
        }

        return () => void controls.detach();
    }, [object, controls, targets]);

    return targets.map((target) => {
        let targetObject = scene.getObjectByName(target);
        if (targetObject !== undefined && targetObject.position !== undefined) {
            return controls.object
                ? controls.object instanceof VolumeObject
                    ? controls.object.getVolumeValue(targetObject.position)
                    : -1
                : -1;
        } else {
            return -1; // NaN
        }
    });
}
