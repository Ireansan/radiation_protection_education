import React, { useEffect, useRef, memo, useMemo } from "react";
import { addEffect } from "@react-three/fiber";
import { useControls, folder, button } from "leva";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

import style from "../../../styles/css/dosimeter.module.css";

type EquipmentProps = {
    goggle: boolean;
    neck: boolean;
    apron: boolean;
    glove: boolean;
};

export function DoseEquipmentsUI({ ...props }) {
    const [set] = useStore((state) => [state.set]);

    /**
     * leva panels
     */
    // Volume
    const [dosimeterConfig, setVolume] = useControls(() => ({
        Player: folder({
            Equipments: folder({
                Goggle: {
                    value: false,
                    onChange: (e) => {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                playerState: {
                                    ...state.sceneStates.playerState,
                                    equipments: {
                                        ...state.sceneStates.playerState
                                            .equipments,
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
                    },
                },
                NeckGuard: {
                    value: false,
                    label: "Neck Guard",
                    onChange: (e) => {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                playerState: {
                                    ...state.sceneStates.playerState,
                                    equipments: {
                                        ...state.sceneStates.playerState
                                            .equipments,
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
                    },
                },
                Apron: {
                    value: false,
                    onChange: (e) => {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                playerState: {
                                    ...state.sceneStates.playerState,
                                    equipments: {
                                        ...state.sceneStates.playerState
                                            .equipments,
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
                    },
                },
                Glove: {
                    value: false,
                    onChange: (e) => {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                playerState: {
                                    ...state.sceneStates.playerState,
                                    equipments: {
                                        ...state.sceneStates.playerState
                                            .equipments,
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
                    },
                },
            }),
        }),
    }));

    return <></>;
}
