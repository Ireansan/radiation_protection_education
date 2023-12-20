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
import { useStore } from "../../store";

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
    const [set] = useStore((state) => [state.set]);

    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls(() => ({
        Data: folder({
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
                            console.log(e);
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
                            switch (e) {
                                case "parula":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        parula: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "heat":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        heat: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "jet":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        jet: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "turbo":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        turbo: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "hot":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        hot: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "gray":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        gray: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "magma":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        magma: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "inferno":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        inferno: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "plasma":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        plasma: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "viridis":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        viridis: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "cividis":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        cividis: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "github":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        github: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "cubehelix":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    colormap: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter.colormap,
                                                        cubehelix: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                            }
                        },
                    },
                    renderstyle: {
                        value: renderstyle,
                        options: ["mip", "iso"],
                        onChange: (e) => {
                            controls.renderstyle = e;

                            // set execute log for experiment
                            switch (e) {
                                case "mip":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    renderStyle: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter
                                                            .renderStyle,
                                                        mip: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                                case "iso":
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                parameter: {
                                                    ...state.sceneStates
                                                        .executeLog.parameter,
                                                    renderStyle: {
                                                        ...state.sceneStates
                                                            .executeLog
                                                            .parameter
                                                            .renderStyle,
                                                        iso: true,
                                                    },
                                                },
                                            },
                                        },
                                    }));
                                    break;
                            }
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
                { collapsed: true }
            ),
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
            <primitive
                ref={ref}
                object={controls}
            />
            {/* FIXME: Only supported by VolumeGroup */}
            <volumeGroup ref={group}>{children}</volumeGroup>
        </>
    ) : null;
});
