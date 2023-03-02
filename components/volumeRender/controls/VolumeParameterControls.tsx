import React from "react";
import * as THREE from "three";
import { extend, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../core";
extend({ VolumeObject, VolumeGroup });
import type { VolumeControlsTypes } from "./types";

export type VolumeParameterControlsProps = VolumeControlsTypes;
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeParameterControls = React.forwardRef<
    VolumeParameterControlsProps,
    VolumeParameterControlsProps
>(function VolumeParameterControls({ children, object, ...props }, ref) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls("volume", () => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.clim2 = e;
            },
        },
        colormap: {
            value: "viridis",
            options: [
                "parula",
                "heat",
                "jet",
                "turbo",
                "hot",
                "gray",
                "magma",
                "inferno",
                "plasma",
                "viridis",
                "cividis",
                "github",
                "cubehelix",
            ],
            onChange: (e) => {
                controls.colormap = e;
            },
        },
        renderstyle: {
            options: ["mip", "iso"],
            onChange: (e) => {
                controls.renderstyle = e;
                console.log("leva renderstyle", object);
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.isothreshold = e;
            },
        },
    }));

    // Attach volume to controls
    React.useLayoutEffect(() => {
        if (object) {
            if (
                object instanceof VolumeObject ||
                object instanceof VolumeGroup
            ) {
                controls.attach(object);
            } else if (
                object.current instanceof VolumeObject ||
                object.current instanceof VolumeGroup
            ) {
                controls.attach(object.current);
            }
        } else if (group.current instanceof VolumeGroup) {
            controls.attach(group.current);
        }

        return () => void controls.detach();
    }, [object, children, controls]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />
            <volumeGroup ref={group}>{children}</volumeGroup>
        </>
    ) : null;
});
