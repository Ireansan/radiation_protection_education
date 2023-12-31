import React from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useControls, folder, button, Leva } from "leva";

import { DoseAnimationObject, VolumeAnimationObject } from "../../../../src";
extend({ VolumeAnimationObject });

export type VolumeAnimationControlsProps = {
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    duration: number;
    folderName?: string;
};
export function VolumeAnimationControls({
    objects,
    duration,
    folderName = "Animation",
    ...props
}: VolumeAnimationControlsProps) {
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

        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [objects]);

    React.useEffect(() => {
        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
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
            // FIXME: will remove "loop"
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
                value: 1.0,
                min: 0.25,
                max: duration,
                step: 0.05,
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
    }));

    useFrame((state, delta) => {
        if (edit) {
            actions.forEach((actions, i) => {
                actions["volumeAnimation"]
                    ? (actions["volumeAnimation"].time = animationConfig.time)
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
            actionsMaxLength["volumeAnimation"].time !== animationConfig.time &&
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
    });

    return (
        <>
            {/* {console.log("animation rendering")} */}
            {/* {console.log("animation", childMaxLength, mixer)} */}
        </>
    );
}
