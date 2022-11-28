import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

import * as DOSE_ALL from "./Dose_all";
import { VolumeGroup, VolumeAnimationObject } from "../../volumeRender";
extend({ VolumeGroup, VolumeAnimationObject });

export function Dose_all_Animation({
    ...props
}: JSX.IntrinsicElements["volumeAnimationObject"]) {
    const group = useRef<VolumeAnimationObject>(null!);

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

    useEffect(() => {
        group.current.animations.forEach((clip) => {
            lazyActions.current[clip.name] = mixer.clipAction(
                clip,
                actualRef.current
            );
        });
        setActions(lazyActions.current);
    }, [group]);

    useEffect(() => {
        actions["volumeAnimation"]?.reset().play();
    }, [actions]);

    useFrame((state, delta) => mixer.update(delta * 16));

    return (
        <>
            <volumeAnimationObject ref={group} {...props}>
                <DOSE_ALL.Dose_all_1 />
                <DOSE_ALL.Dose_all_2 />
                <DOSE_ALL.Dose_all_3 />
                <DOSE_ALL.Dose_all_4 />
                <DOSE_ALL.Dose_all_5 />
                <DOSE_ALL.Dose_all_6 />
                <DOSE_ALL.Dose_all_7 />
                <DOSE_ALL.Dose_all_8 />
                <DOSE_ALL.Dose_all_9 />
                <DOSE_ALL.Dose_all_10 />
                <DOSE_ALL.Dose_all_11 />
                <DOSE_ALL.Dose_all_12 />
                <DOSE_ALL.Dose_all_13 />
                <DOSE_ALL.Dose_all_14 />
                <DOSE_ALL.Dose_all_15 />
                <DOSE_ALL.Dose_all_16 />
            </volumeAnimationObject>
        </>
    );
}
