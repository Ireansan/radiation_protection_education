import React from "react";
import * as THREE from "three";
import { extend, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../../../src";
extend({ VolumeObject, VolumeGroup });
import type { VolumeControlsTypes } from "./types";

export type VolumeParameterControlsProps = {
    folderName?: string;
    opacity?: number;
    clim1?: number;
    clim2?: number;
    colormap?: string;
    renderstyle?: string;
    isothreshold?: number;
} & VolumeControlsTypes;
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeParameterControls = React.forwardRef<
    VolumeControlsImpl,
    VolumeParameterControlsProps
>(function VolumeParameterControls(
    {
        children,
        object,
        folderName = "volume",
        opacity = 0.75,
        clim1 = 0,
        clim2 = 1,
        colormap = "viridis",
        renderstyle = "mip",
        isothreshold = 0.15,
        ...props
    },
    ref
) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls(() => ({
        [folderName as string]: folder({
            opacity: {
                value: opacity,
                min: 0.05,
                max: 1,
                onChange: (e) => {
                    controls.opacity = e;
                },
            },
            clim1: {
                value: clim1,
                min: 0,
                max: 1,
                onChange: (e) => {
                    controls.clim1 = e;
                },
                render: () => {
                    return false;
                },
            },
            clim2: {
                value: 1,
                min: 0,
                max: 1,
                onChange: (e) => {
                    controls.clim2 = e;
                },
                render: () => {
                    return false;
                },
            },
            colormap: {
                value: colormap,
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
                value: renderstyle,
                options: ["mip", "iso"],
                onChange: (e) => {
                    controls.renderstyle = e;
                    console.log("leva renderstyle", object);
                },
            },
            isothreshold: {
                value: isothreshold,
                min: 0,
                max: 1,
                onChange: (e) => {
                    controls.isothreshold = e;
                },
            },
        }),
    }));

    React.useEffect(() => {
        controls.opacity = opacity;
        controls.clim1 = clim1;
        controls.clim2 = clim2;
        controls.colormap = colormap;
        controls.renderstyle = renderstyle;
        controls.isothreshold = isothreshold;
    }, [controls, opacity, clim1, clim2, colormap, renderstyle, isothreshold]);

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
