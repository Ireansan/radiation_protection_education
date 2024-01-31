import { useMemo, useEffect } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { useStore, getState } from "../../store";
import type { Controls, States } from "../../store";

import { applyBasePath } from "../../../utils";

interface ActionConfig extends ActionMap {
    actionName: string;
    filepath: string;
}
interface ActionMap {
    initWeight: number;
    fn: (controls: Controls) => number;
}

/**
 * FIXME: mode detail
 * Animation Hook
 * @link
 */
function useAnimationStates(actionConfig: ActionConfig[]) {
    let controls: Controls;

    const animationClips: THREE.AnimationClip[] = [];
    actionConfig.forEach(({ filepath }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { animations } = useGLTF(applyBasePath(filepath));
        animationClips.push(...animations);
    });

    const { actions, mixer, ref } = useAnimations(animationClips);

    /**
     * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
     */
    function setWeight(actionName: string, weight: number) {
        if (actions[actionName]) {
            actions[actionName]!.enabled = true;
            // actions[actionName]!.setEffectiveTimeScale(1);
            actions[actionName]!.setEffectiveWeight(weight);
        }
    }

    // Init
    useEffect(() => {
        actionConfig.forEach(({ actionName, initWeight }) => {
            setWeight(actionName, initWeight);
            actions[actionName]?.play();
        });
    }, []);

    useFrame((state) => {
        controls = getState().controls;

        actionConfig.forEach(({ actionName, fn }) => {
            setWeight(actionName, fn(controls));
        });
    });

    return { ref, mixer };
}

export function AnimationStates() {
    const controlsUtil = (controls: Controls) => {
        const { jump, grounded, ...rest } = controls;
        const { forward, backward, left, right } = rest;
        const moveArray = [forward, backward, left, right];

        // [x, z]
        let tmp = [
            Number(right) - Number(left),
            Number(forward) - Number(backward),
        ];
        let tmpRad = Math.atan2(tmp[1], tmp[0]);
        // console.log(Math.cos(tmpRad), Math.sin(tmpRad));

        const isGround = !jump && grounded;
        const isMoving = forward || backward || left || right || !isGround;

        return {
            isGround: isGround,
            isMoving: isMoving,
            moveSum: moveArray.reduce((acc: number, val: boolean): number => {
                return acc + Number(val);
            }, 0),
        };
    };

    const moveWeight = (state: boolean, controls: Controls): number => {
        const { isGround, moveSum } = controlsUtil(controls);

        return moveSum ? Number(isGround && state) / moveSum : 0;
    };

    const glbPath = `/models/glb/animations`;

    return useAnimationStates([
        {
            actionName: "Idle",
            filepath: `${glbPath}/Idle.glb`,
            initWeight: 1,
            fn: (controls) => {
                const { isGround, moveSum } = controlsUtil(controls);
                return isGround && !Boolean(moveSum) ? 1 : 0;
            },
        },
        {
            actionName: "Falling Idle",
            filepath: `${glbPath}/Falling Idle.glb`,
            initWeight: 0,
            fn: (controls) => {
                const { grounded } = controls;
                return Number(!grounded);
            },
        },
        {
            actionName: "Standard Walk",
            filepath: `${glbPath}/Standard Walk.glb`,
            initWeight: 0,
            fn: (controls) => {
                const { forward } = controls;
                return moveWeight(forward, controls);
            },
        },
        {
            actionName: "Walking Backward",
            filepath: `${glbPath}/Walking Backward.glb`,
            initWeight: 0,
            fn: (controls) => {
                const { backward } = controls;
                return moveWeight(backward, controls);
            },
        },
        {
            actionName: "Left Strafe Walking",
            filepath: `${glbPath}/Left Strafe Walking.glb`,
            initWeight: 0,
            fn: (controls) => {
                const { backward, left, right } = controls;
                return moveWeight(
                    (left && !backward) || (right && backward),
                    controls
                );
            },
        },
        {
            actionName: "Right Strafe Walking",
            filepath: `${glbPath}/Right Strafe Walking.glb`,
            initWeight: 0,
            fn: (controls) => {
                const { backward, left, right } = controls;
                return moveWeight(
                    (right && !backward) || (left && backward),
                    controls
                );
            },
        },
    ]);
}
