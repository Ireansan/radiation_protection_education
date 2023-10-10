import React from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useControls, folder, button, Leva } from "leva";

import {
    VolumeBase,
    DoseAnimationObject,
    VolumeAnimationObject,
} from "../../../../src";
extend({ VolumeAnimationObject });

export type DoseAnimationControlsProps = {
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    mainGroup: React.RefObject<VolumeBase>;
    subGroup?: React.RefObject<VolumeBase>;
    duration: number;
    customSpeed?: number[];
    folderName?: string;
};
export function DoseAnimationControls({
    objects,
    mainGroup,
    subGroup,
    duration,
    customSpeed,
    folderName = "animation",
    ...props
}: DoseAnimationControlsProps) {
    const childMaxLength = React.useRef<{
        index: number;
        length: number;
    }>({
        index: 0,
        length: 1,
    });

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

    let speedListTmp = [0.25, 0.5, 1.0, 1.5, 2.0];
    const speedList = customSpeed
        ? speedListTmp.concat(customSpeed)
        : speedListTmp;

    React.useEffect(() => {
        objects.forEach((object, i) => {
            if (object.current) {
                object.current.animations.forEach((clip) => {
                    lazyActions.current[i][clip.name] = mixer[i].clipAction(
                        clip,
                        object.current!
                    );

                    if (childMaxLength.current.length <= clip.duration) {
                        childMaxLength.current = {
                            index: i,
                            length: clip.duration,
                        };
                    }
                });
            }
        });
        setActions(lazyActions.current);

        actions.forEach((actions) =>
            actions["volumeAnimation"]?.reset().play()
        );
    }, [objects]);

    React.useEffect(() => {
        actions.forEach((actions) =>
            actions["volumeAnimation"]?.reset().play()
        );
    }, [actions]);

    /**
     * leva panels
     *
     * @link https://codesandbox.io/s/leva-theme-j0q0j?file=/src/App.jsx
     * @link https://codesandbox.io/s/leva-custom-plugin-l4xmm?file=/src/App.tsx
     */
    const [edit, setEdit] = React.useState<boolean>(false);
    const [animationConfig, setAnimationConfig] = useControls(() => ({
        [folderName as string]: folder({
            mode: {
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
                },
            },
            "time lapse config": folder({
                play: {
                    value: true,
                    onChange: (e) => {
                        lazyActions.current.forEach((actions) => {
                            actions["volumeAnimation"]
                                ? (actions["volumeAnimation"].paused = !e)
                                : null;
                        });
                    },
                },
                loop: {
                    value: true,
                    onChange: (e) => {
                        lazyActions.current.forEach((actions) => {
                            actions["volumeAnimation"]
                                ? actions["volumeAnimation"].setLoop(
                                      THREE.LoopRepeat,
                                      e ? Infinity : 0
                                  )
                                : null;
                        });
                    },
                },
                speed: {
                    options: speedList,
                    value: 1.0,
                },
                time: {
                    value: 0,
                    min: 0,
                    max: duration,
                    step: 1,
                    onEditStart: (value, path, context) => {
                        setEdit(true);
                    },
                    onEditEnd: (value, path, context) => {
                        setEdit(false);
                    },
                },
            }),
        }),
    }));

    useFrame((state, delta) => {
        if (mainGroup.current?.visible) {
            if (edit) {
                actions.forEach((actions, i) => {
                    actions["volumeAnimation"]
                        ? (actions["volumeAnimation"].time =
                              animationConfig.time)
                        : null;
                });
                mixer.forEach((mixer, i) => {
                    mixer.update(0);
                });
            } else {
                mixer.forEach((mixer) => {
                    mixer.update(delta * animationConfig.speed);
                });
            }

            let actionsMaxLength = actions[childMaxLength.current.index];
            if (actionsMaxLength["volumeAnimation"]) {
                actionsMaxLength["volumeAnimation"].time !==
                    animationConfig.time &&
                actionsMaxLength["volumeAnimation"].time <= duration
                    ? setAnimationConfig({
                          time: actionsMaxLength["volumeAnimation"].time,
                      })
                    : null;
            }

            if (objects) {
                objects.forEach((object) => {
                    if (object.current) {
                        object.current.index = Math.floor(animationConfig.time);
                    }
                });
            }
        } else {
        }
    });

    return (
        <>
            {/* {console.log("animation rendering")} */}
            {/* {console.log("animation", childMaxLength, mixer)} */}
        </>
    );
}
