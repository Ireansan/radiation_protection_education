import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
// import { GUI } from "lil-gui";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
    VolumeBase,
} from "../../../../src";
import type { VolumeParameterControlsProps } from "../../../../components/volumeRender";
import { useStore } from "../../../store";

/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VRVolumeParameterControls = React.forwardRef<
    VolumeControlsImpl,
    VolumeParameterControlsProps
>(function VRVolumeParameterControls(
    {
        children, // FIXME: Only supported by VolumeGroup
        object,
        opacity = 0.6,
        clim1 = 0,
        clim2 = 1,
        colormap = "viridis",
        renderstyle = "mip",
        isothreshold = 0.15,
        activeClim = false,
        ...props
    },
    ref,
) {
    const colormapList = [
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
    ];
    const renderstyleList = ["mip", "iso"];
    const parameters = {
        opacity: opacity,
        clim1: clim1,
        clim2: clim2,
        colormap: colormapList.indexOf(colormap),
        renderstyle: renderstyleList.indexOf(renderstyle),
        isothreshold: isothreshold,
    };

    const [set] = useStore((state) => [state.set]);

    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const groupRef = React.useRef<VolumeGroup>(null);

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera],
    );

    /**
     * lil-gui
     */
    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            const folder = gui.addFolder("Parameter");
            folder
                .add(parameters, "opacity", opacity)
                .min(0.05)
                .max(1)
                .step(1e-2)
                .onChange((e: number) => {
                    controls.opacity = e;
                });
            if (activeClim) {
                folder
                    .add(parameters, "clim1", clim1, 1)
                    .min(0)
                    .max(1)
                    .step(1e-2)
                    .onChange((e: number) => {
                        controls.clim1 = e;
                    });
                folder
                    .add(parameters, "clim2", clim2, 1)
                    .min(0)
                    .max(1)
                    .step(1e-2)
                    .onChange((e: number) => {
                        controls.clim2 = e;
                    });
            }
            folder
                .add(parameters, "colormap")
                .min(0)
                .max(colormapList.length - 1) // == 12
                .step(1)
                .name("colormap (Type)")
                .onChange((i: number) => {
                    const e = colormapList[i];
                    controls.colormap = e;

                    // set execute log for experiment
                    switch (e) {
                        case "parula":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                parula: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "heat":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                heat: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "jet":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                jet: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "turbo":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                turbo: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "hot":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                hot: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "gray":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                gray: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "magma":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                magma: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "inferno":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                inferno: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "plasma":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                plasma: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "viridis":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                viridis: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "cividis":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                cividis: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "github":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                github: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                        case "cubehelix":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            colormap: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .colormap,
                                                cubehelix: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                    }
                });
            folder
                .add(parameters, "renderstyle")
                .min(0)
                .max(1)
                .step(1)
                .name("renderstyle (Type)")
                .onChange((i: number) => {
                    const e = renderstyleList[i];
                    controls.renderstyle = e;

                    // set execute log for experiment
                    switch (e) {
                        case "mip":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            renderStyle: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
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
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        parameter: {
                                            ...state.sceneProperties.executeLog
                                                .parameter,
                                            renderStyle: {
                                                ...state.sceneProperties
                                                    .executeLog.parameter
                                                    .renderStyle,
                                                iso: true,
                                            },
                                        },
                                    },
                                },
                            }));
                            break;
                    }
                });
            folder
                .add(parameters, "isothreshold", isothreshold)
                .min(0)
                .max(1)
                .step(1e-2)
                .onChange((e: number) => {
                    controls.isothreshold = e;
                });

            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

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
        } else if (groupRef.current instanceof VolumeGroup) {
            controls.attach(groupRef.current);
        }

        return () => void controls.detach();
    }, [object, children, controls]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />
            <primitive object={group} {...props} />
            {/* FIXME: Only supported by VolumeGroup */}
            <volumeGroup ref={groupRef}>{children}</volumeGroup>
        </>
    ) : null;
});
