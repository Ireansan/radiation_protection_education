import React from "react";
import { useThree } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
// import { GUI } from "lil-gui";

import { useStore } from "../../store";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRDoseEquipmentsUI({
    ...props
}: JSX.IntrinsicElements["group"]) {
    const parameters = {
        Goggle: 0,
        Neck: 0,
        Apron: 0,
        Glove: 0,
    };

    const [set] = useStore((state) => [state.set]);
    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );

    /**
     * lil-gui
     */
    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            const folder = gui.addFolder("Equipments");
            folder
                .add(parameters, "Goggle")
                .min(0)
                .max(1)
                .step(1)
                .name("Goggle (on/off)")
                .onChange((n: number) => {
                    const e: boolean = n ? true : false;

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            playerState: {
                                ...state.sceneStates.playerState,
                                equipments: {
                                    ...state.sceneStates.playerState.equipments,
                                    goggle: e,
                                },
                            },
                        },
                    }));

                    // set execute log for experiment
                    if (e) {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    dosimeter: {
                                        ...state.sceneStates.executeLog
                                            .dosimeter,
                                        goggle: true,
                                    },
                                },
                            },
                        }));
                    }
                });
            folder
                .add(parameters, "Neck")
                .min(0)
                .max(1)
                .step(1)
                .name("Neck (on/off)")
                .onChange((n: number) => {
                    const e: boolean = n ? true : false;

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            playerState: {
                                ...state.sceneStates.playerState,
                                equipments: {
                                    ...state.sceneStates.playerState.equipments,
                                    neck: e,
                                },
                            },
                        },
                    }));

                    // set execute log for experiment
                    if (e) {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    dosimeter: {
                                        ...state.sceneStates.executeLog
                                            .dosimeter,
                                        neckGuard: true,
                                    },
                                },
                            },
                        }));
                    }
                });
            folder
                .add(parameters, "Apron")
                .min(0)
                .max(1)
                .step(1)
                .name("Apron (on/off)")
                .onChange((n: number) => {
                    const e: boolean = n ? true : false;

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            playerState: {
                                ...state.sceneStates.playerState,
                                equipments: {
                                    ...state.sceneStates.playerState.equipments,
                                    apron: e,
                                },
                            },
                        },
                    }));

                    // set execute log for experiment
                    if (e) {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    dosimeter: {
                                        ...state.sceneStates.executeLog
                                            .dosimeter,
                                        apron: true,
                                    },
                                },
                            },
                        }));
                    }
                });
            folder
                .add(parameters, "Glove")
                .min(0)
                .max(1)
                .step(1)
                .name("Glove (on/off)")
                .onChange((n: number) => {
                    const e: boolean = n ? true : false;

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            playerState: {
                                ...state.sceneStates.playerState,
                                equipments: {
                                    ...state.sceneStates.playerState.equipments,
                                    glove: e,
                                },
                            },
                        },
                    }));

                    // set execute log for experiment
                    if (e) {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    dosimeter: {
                                        ...state.sceneStates.executeLog
                                            .dosimeter,
                                        glove: true,
                                    },
                                },
                            },
                        }));
                    }
                });

            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

    return (
        <>
            <primitive
                object={group}
                {...props}
            />
        </>
    );
}
