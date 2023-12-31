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
} from "../../../../src";
import { useStore } from "../../../store";

export type VolumeParameterControlsProps =
    JSX.IntrinsicElements["volumeGroup"] & {
        children?: React.ReactElement<VolumeBase>;
        object?: VolumeBase | React.RefObject<VolumeBase>;
        opacity?: number;
        clim1?: number;
        clim2?: number;
        cmin?: number;
        cmax?: number;
        climStep?: number;
        colormap?: string;
        renderstyle?: string;
        isothreshold?: number;
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
        opacity = 0.6,
        clim1 = 0,
        clim2 = 1,
        cmin = 0,
        cmax = 1,
        climStep = 0.01,
        colormap = "heat",
        renderstyle = "mip",
        isothreshold = 0.15,
        ...props
    },
    ref
) {
    const [set, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates,
    ]);

    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls(() => ({
        Data: folder(
            {
                Detail: folder(
                    {
                        opacity: {
                            value: opacity,
                            min: 0.05,
                            max: 1,
                            onChange: (e) => {
                                controls.opacity = e;
                            },
                        },
                        clim: {
                            value: [clim1, clim2],
                            min: cmin,
                            max: cmax,
                            step: climStep,
                            onChange: (e) => {
                                controls.clim1 = e[0];
                                controls.clim2 = e[1];
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

                                // set execute log for experiment
                                const _colormap =
                                    sceneStates.executeLog.parameter.colormap;
                                _colormap[e] = true;

                                set((state) => ({
                                    sceneStates: {
                                        ...state.sceneStates,
                                        executeLog: {
                                            ...state.sceneStates.executeLog,
                                            parameter: {
                                                ...state.sceneStates.executeLog
                                                    .parameter,
                                                colormap: _colormap,
                                            },
                                        },
                                    },
                                }));
                            },
                        },
                        renderstyle: {
                            value: renderstyle,
                            options: ["mip", "iso"],
                            onChange: (e) => {
                                controls.renderstyle = e;

                                // set execute log for experiment
                                const _renderStyle =
                                    sceneStates.executeLog.parameter
                                        .renderStyle;
                                _renderStyle[e] = true;

                                set((state) => ({
                                    sceneStates: {
                                        ...state.sceneStates,
                                        executeLog: {
                                            ...state.sceneStates.executeLog,
                                            parameter: {
                                                ...state.sceneStates.executeLog
                                                    .parameter,
                                                renderStyle: _renderStyle,
                                            },
                                        },
                                    },
                                }));
                            },
                        },
                        isothreshold: {
                            value: isothreshold,
                            min: 0,
                            max: 1,
                            step: 0.001,
                            onChange: (e) => {
                                controls.isothreshold = e;

                                // set();
                            },
                        },
                    },
                    { order: 1, collapsed: true }
                ),
            },
            { order: 1 }
        ),
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
            <primitive
                ref={ref}
                object={controls}
            />
            {/* FIXME: Only supported by VolumeGroup */}
            <volumeGroup ref={group}>{children}</volumeGroup>
        </>
    ) : null;
});
