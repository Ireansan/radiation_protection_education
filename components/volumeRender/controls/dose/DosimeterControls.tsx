import React from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";

// ==========
// Volume
// ----------
// object
import {
    VolumeObject,
    VolumeGroup,
    Dosimeter as DosimeterImpl,
    VolumeBase,
} from "../../../../src";
// ----------
// type
import type { SpecifiedSite } from "../../../../src";

// ==========
// Store
import { useStore } from "../../../store";

export type DosimeterControlsProps = {
    children?: React.ReactElement<VolumeObject | VolumeGroup>;
    object: React.RefObject<THREE.Object3D>;
    names: SpecifiedSite[];
    targets: React.RefObject<VolumeBase>[];
};
/**
 * Dosimeter (controls only).
 * @param children - target player object.
 * @param object - target player object.
 * @param names - survey points to obtain dose values.
 * @param targets - volume datas to obtain dose values.
 */
export const DosimeterControls = React.forwardRef<
    DosimeterImpl,
    DosimeterControlsProps
>(function DosimeterControls(
    { children, object, targets, names = [], ...props },
    ref
) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    // useStore
    const [set] = useStore((state) => [state.set]);

    // --------------------------------------------------
    // Controls
    const controls = React.useMemo(() => new DosimeterImpl(), []);

    // --------------------------------------------------
    // Group
    const group = React.useRef<THREE.Group>(null);

    // ==================================================
    // Hooks (Effect)
    // --------------------------------------------------
    // attach object
    React.useEffect(() => {
        if (object.current) {
            controls.attach(object.current);
        } else if (group.current) {
            controls.attach(group.current);
        }

        return () => {
            controls.detach();
        };
    }, [object, children, controls]);

    // --------------------------------------------------
    // set names
    React.useEffect(() => {
        controls.namesData = names;

        return () => {
            controls.namesData = undefined;
        };
    }, [names, controls]);

    // --------------------------------------------------
    // attach target
    React.useEffect(() => {
        let targetsArray: VolumeBase[] = [];
        for (let i = 0; i < targets.length; i++) {
            let tmp = targets[i].current;
            if (tmp) {
                targetsArray.push(tmp);
            }
        }

        controls.attachTargets(targetsArray);

        return () => {
            controls.detachTargets();
        };
    }, [targets, controls]);

    // --------------------------------------------------
    // Frame
    useFrame(() => {
        controls.updateResults();
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                dosimeterResults: controls.results,
            },
        }));
    });

    // ==================================================
    // Element
    return (
        <>
            <primitive
                ref={ref}
                object={controls}
            />
            <group ref={group}>{children}</group>
        </>
    );
});
