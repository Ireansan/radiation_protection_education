import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

import { VolumeObject } from "./core";

export type VolumeControlsProps = {
    children?: React.ReactElement<VolumeObject>;
    object?: VolumeObject | React.MutableRefObject<VolumeObject>;
};

export const VolumeControls = React.forwardRef<
    VolumeControlsProps,
    VolumeControlsProps
>(function VolumeControls({ children, object, ...props }, ref) {
    React.useLayoutEffect(() => {
        if (object) {
            controls.attach(
                object instanceof THREE.Object3D ? object : object.current
            );
        } else if (group.current instanceof THREE.Object3D) {
            controls.attach(group.current);
        }

        return () => void controls.detach();
    }, [object, children, controls]);

    return null;
});
