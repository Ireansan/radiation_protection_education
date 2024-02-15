import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";

// ==========
// Volume
// ----------
// object
import {
    VolumeBase,
    DoseAnimationObject,
    VolumeAnimationObject,
} from "../../../../src";

// ==========
// Store
import { useStore } from "../../../store";

export type DoseAnimationControlsWithAudioProps = {
    audioRef: React.RefObject<HTMLAudioElement>;
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    mainGroup: React.RefObject<VolumeBase>;
    subGroup?: React.RefObject<VolumeBase>;
    mode?: string;
};
/**
 * Animation controller for volume rendering objects using audio data and mode controller for dose data (control only).
 * @param audioRef - audio data.
 * @param objects - target volume object.
 * @param mainGroup - time lapse volume group.
 * @param subGroup - accumulate volume group.
 * @param mode - mode of data. Default is `time lapse`.
 */
export function DoseAnimationControlsWithAudio({
    audioRef,
    objects,
    mainGroup,
    subGroup,
    mode = "time lapse",
    ...props
}: DoseAnimationControlsWithAudioProps) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    // useStore
    const [set, executeLog] = useStore((state) => [
        state.set,
        state.sceneStates.executeLog,
    ]);

    // --------------------------------------------------
    // Animation mixer, actions
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

    // --------------------------------------------------
    // Control Panel
    const [,] = useControls(() => ({
        Data: folder(
            {
                mode: {
                    value: mode,
                    options: ["time lapse", "accumulate"],
                    order: -2,
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

                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    isTimeLapse: true,
                                },
                            }));
                        } else if (e === "accumulate") {
                            mainGroup.current
                                ? (mainGroup.current.visible = false)
                                : null;

                            if (subGroup) {
                                subGroup.current
                                    ? (subGroup.current.visible = true)
                                    : null;
                            }

                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    isTimeLapse: false,
                                },
                            }));
                        } else {
                            console.log("test");
                        }

                        // set execute log for experiment
                        const _animation = executeLog.animation;
                        console.log(e);
                        _animation[e] = true;

                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    animation: _animation,
                                },
                            },
                        }));
                    },
                },
            },
            { order: 1 }
        ),
    }));

    // ==================================================
    // Hooks (Effect)
    // --------------------------------------------------
    // set actions
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

    // --------------------------------------------------
    // play actions
    React.useEffect(() => {
        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [actions]);

    // --------------------------------------------------
    // Frame
    useFrame((state, delta) => {
        if (!audioRef.current) {
            return;
        }

        if (mainGroup.current?.visible) {
            actions.forEach((actions, i) => {
                actions["volumeAnimation"] && audioRef.current
                    ? (actions["volumeAnimation"].time =
                          audioRef.current.currentTime)
                    : null;
            });
            mixer.forEach((mixer, i) => {
                mixer.update(0);
            });

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

    // ==================================================
    // Element
    return <></>;
}
