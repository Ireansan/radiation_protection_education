import React from "react";
import * as THREE from "three";
import { extend, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
    VolumeBase,
} from "../../../src";
extend({ VolumeObject, VolumeGroup });

export type VolumeParameterControlsProps =
    JSX.IntrinsicElements["volumeGroup"] & {
        children?: React.ReactElement<VolumeBase>;
        object?: VolumeBase | React.RefObject<VolumeBase>;
        folderName?: string;
        opacity?: number;
        clim1?: number;
        clim2?: number;
        colormap?: string;
        renderstyle?: string;
        isothreshold?: number;
        activeClim?: boolean;
    };
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeParameterControls = React.forwardRef<
    VolumeControlsImpl,
    VolumeParameterControlsProps
>(function VolumeParameterControls(
    {
        children, // FIXME: Only supported by VolumeGroup
        object,
        folderName = "Volume",
        opacity = 0.6,
        clim1 = 0,
        clim2 = 1,
        colormap = "viridis",
        renderstyle = "mip",
        isothreshold = 0.15,
        activeClim = false,
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
                    return activeClim;
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
                    return activeClim;
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
    }, [controls, opacity]);
    React.useEffect(() => {
        controls.clim1 = clim1;
    }, [controls, clim1]);
    React.useEffect(() => {
        controls.clim2 = clim2;
    }, [controls, clim2]);
    React.useEffect(() => {
        controls.colormap = colormap;
    }, [controls, colormap]);
    React.useEffect(() => {
        controls.renderstyle = renderstyle;
    }, [controls, renderstyle]);
    React.useEffect(() => {
        controls.isothreshold = isothreshold;
    }, [controls, isothreshold]);

    // Attach volume to controls
    React.useLayoutEffect(() => {
        if (object) {
            if (object instanceof VolumeBase) {
                controls.attach(object);
            } else if (object.current instanceof VolumeBase) {
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
            {/* FIXME: Only supported by VolumeGroup */}
            <volumeGroup ref={group}>{children}</volumeGroup>
        </>
    ) : null;
});
