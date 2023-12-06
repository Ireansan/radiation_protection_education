import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { styled, Box, Paper, Stack, Slider, Typography } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useControls, folder } from "leva";

import {
    VolumeBase,
    DoseAnimationObject,
    VolumeAnimationObject,
} from "../../../../src";
import { useStore } from "../../../store";

export type PrototypeAnimationControlsProps = {
    audioRef: React.RefObject<HTMLAudioElement>;
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    mainGroup: React.RefObject<VolumeBase>;
    subGroup?: React.RefObject<VolumeBase>;
    mode?: string;
};
export function PrototypeAnimationControls({
    audioRef,
    objects,
    mainGroup,
    subGroup,
    mode = "time lapse",
    ...props
}: PrototypeAnimationControlsProps) {
    const [set] = useStore((state) => [state.set]);

    /**
     * @link https://github.com/pmndrs/drei/blob/cce70ae77b5151601089114259fbffab8747c8fa/src/core/useAnimations.tsx
     */
    const [mixer] = React.useState<THREE.AnimationMixer[]>(
        objects.map(
            (object, i) =>
                new THREE.AnimationMixer(undefined as unknown as THREE.Object3D)
        )
    );
    const [actions, setActions] = React.useState(() => {
        const actions = objects.map((object, i) => {
            return {};
        }) as {
            [key in THREE.AnimationClip["name"]]: THREE.AnimationAction | null;
        }[];

        return actions;
    });
    const lazyActions = React.useRef<
        {
            [key: string]: THREE.AnimationAction | null;
        }[]
    >(
        objects.map((object, i) => {
            return {};
        })
    );

    const audioPlayer = React.useRef<HTMLAudioElement>(null!);

    const [isEditing, setIsEditing] = React.useState<boolean>(false);

    const [,] = useControls(() => ({
        Data: folder({
            mode: {
                value: mode,
                options: ["time lapse", "accumulate"],
                onChange: (e) => {
                    if (e === "time lapse") {
                        mainGroup.current
                            ? (mainGroup.current.visible = true)
                            : null;

                        if (subGroup) {
                            subGroup.current
                                ? (subGroup.current.visible = false)
                                : null;
                        }
                    } else if (e === "accumulate") {
                        mainGroup.current
                            ? (mainGroup.current.visible = false)
                            : null;

                        if (subGroup) {
                            subGroup.current
                                ? (subGroup.current.visible = true)
                                : null;
                        }
                    } else {
                        console.log("test");
                    }

                    // set execute log for experiment
                    switch (e) {
                        case "time lapse":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        animation: {
                                            ...state.sceneProperties.executeLog
                                                .animation,
                                            timeLapse: true,
                                        },
                                    },
                                },
                            }));
                            break;
                        case "accumulate":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        animation: {
                                            ...state.sceneProperties.executeLog
                                                .animation,
                                            accumulate: true,
                                        },
                                    },
                                },
                            }));
                            break;
                    }
                },
            },
        }),
    }));

    React.useEffect(() => {
        objects.forEach((object, i) => {
            if (object.current) {
                object.current.animations.forEach((clip) => {
                    lazyActions.current[i][clip.name] = mixer[i].clipAction(
                        clip,
                        object.current!
                    );
                });
            }
        });
        setActions(lazyActions.current);

        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [objects]);

    React.useEffect(() => {
        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [actions]);

    useFrame((state, delta) => {
        if (!audioRef.current) {
            return;
        }

        if (mainGroup.current?.visible) {
            if (audioRef.current.paused) {
                actions.forEach((actions, i) => {
                    actions["volumeAnimation"] && audioRef.current
                        ? (actions["volumeAnimation"].time =
                              audioRef.current.currentTime)
                        : null;
                });
                mixer.forEach((mixer, i) => {
                    mixer.update(0);
                });
            } else {
                mixer.forEach((mixer) => {
                    const speed = audioRef.current
                        ? audioRef.current.playbackRate
                        : 1.0;
                    mixer.update(delta * speed);
                });
            }

            if (objects) {
                objects.forEach((object) => {
                    if (object.current && audioRef.current) {
                        object.current.index = Math.floor(
                            audioRef.current.currentTime
                        );
                    }
                });
            }
        } else {
        }
    });

    return <></>;
}