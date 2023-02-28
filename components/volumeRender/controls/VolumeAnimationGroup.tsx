import React from "react";
import * as THREE from "three";
import { extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import { useControls, folder, button, Leva } from "leva";

import { VolumeObject, VolumeGroup, VolumeAnimationObject } from "../core";
extend({ VolumeAnimationObject });

export type VolumeAnimationGroupProps =
    JSX.IntrinsicElements["volumeAnimationObject"] & {
        children?: React.ReactElement<VolumeObject | VolumeGroup>[];
        folderName?: string;
    };
export function VolumeAnimationGroup({
    children,
    folderName = "animation",
    ...props
}: VolumeAnimationGroupProps) {
    const group = React.useRef<VolumeAnimationObject>(null!);

    /**
     * @link https://github.com/pmndrs/drei/blob/cce70ae77b5151601089114259fbffab8747c8fa/src/core/useAnimations.tsx
     */
    const [actualRef] = React.useState(() =>
        group
            ? group instanceof THREE.Object3D
                ? { current: group }
                : group
            : group
    );
    const [mixer] = React.useState(
        () => new THREE.AnimationMixer(undefined as unknown as THREE.Object3D)
    );
    const [actions, setActions] = React.useState(() => {
        const actions = {} as {
            [key in THREE.AnimationClip["name"]]: THREE.AnimationAction | null;
        };

        return actions;
    });
    const lazyActions = React.useRef<{
        [key: string]: THREE.AnimationAction | null;
    }>({});

    React.useEffect(() => {
        group.current.animations.forEach((clip) => {
            lazyActions.current[clip.name] = mixer.clipAction(
                clip,
                actualRef.current
            );
        });
        setActions(lazyActions.current);

        actions["volumeAnimation"]?.reset().play();
    }, [group]);

    React.useEffect(() => {
        actions["volumeAnimation"]?.reset().play();
    }, [actions]);

    /**
     * leva panels
     *
     * @link https://codesandbox.io/s/leva-theme-j0q0j?file=/src/App.jsx
     * @link https://codesandbox.io/s/leva-custom-plugin-l4xmm?file=/src/App.tsx
     */
    const [childrenLength] = React.useState<number>(
        React.Children.count(children)
    );

    const [edit, setEdit] = React.useState<boolean>(false);
    const [animationConfig, setAnimationConfig] = useControls(() => ({
        [folderName as string]: folder({
            play: {
                value: true,
                onChange: (e) => {
                    lazyActions.current["volumeAnimation"]
                        ? (lazyActions.current["volumeAnimation"].paused = !e)
                        : null;
                },
            },
            // FIXME: will remove "loop"
            loop: {
                value: true,
                onChange: (e) => {
                    lazyActions.current["volumeAnimation"]
                        ? lazyActions.current["volumeAnimation"].setLoop(
                              THREE.LoopRepeat,
                              e ? Infinity : 0
                          )
                        : null;
                },
            },
            speed: {
                value: 1.0,
                min: 0.25,
                max: childrenLength,
                step: 0.05,
            },
            time: {
                value: 1,
                min: 0,
                max: childrenLength - 1,
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
            actions["volumeAnimation"]
                ? (actions["volumeAnimation"].time = animationConfig.time)
                : null;
            mixer.update(0);
        } else {
            mixer.update(delta * animationConfig.speed);
        }

        if (actions["volumeAnimation"]) {
            actions["volumeAnimation"].time !== animationConfig.time &&
            actions["volumeAnimation"].time <= childrenLength - 1
                ? setAnimationConfig({
                      time: actions["volumeAnimation"].time,
                  })
                : null;
        }

        group.current.index = Math.floor(animationConfig.time);
    });

    return (
        <>
            <volumeAnimationObject ref={group} {...props}>
                {children}
            </volumeAnimationObject>
        </>
    );
}
