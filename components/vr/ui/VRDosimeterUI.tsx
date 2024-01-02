import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useXREvent } from "@react-three/xr";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";

import { Dosimeter as DosimeterImpl, VolumeBase } from "../../../src";
import type { DosimeterControlsProps } from "../../volumeRender";
import { useStore } from "../../store";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export const VRDosimeterControls = React.forwardRef<
    DosimeterImpl,
    DosimeterControlsProps & JSX.IntrinsicElements["group"]
>(function VRDosimeterControls(
    { children, object, targets, names = [], ...props },
    ref
) {
    const [set] = useStore((state) => [state.set]);

    const controls = React.useMemo(() => new DosimeterImpl(), []);

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );
    const dosimeterUIMesh = React.useMemo(() => {
        const dosimeterUI = document.getElementById(
            "XRDosimeterUI"
        ) as HTMLElement;
        dosimeterUI.style.height = `${2 * 30 + 15}px`;

        const dosimeterUIMesh = new HTMLMesh(dosimeterUI);
        group.add(dosimeterUIMesh);

        return dosimeterUIMesh;
    }, [group]);

    // Init
    React.useEffect(() => {
        if (object.current) {
            controls.attach(object.current);
        }

        return () => {
            controls.detach();
        };
    }, [object, controls]);

    React.useEffect(() => {
        controls.namesData = names;

        return () => {
            controls.namesData = undefined;
        };
    }, [names, controls]);

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

    const updateDosimeterUI = () => {
        controls.updateResults();
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                dosimeterResults: controls.results,
            },
        }));

        // @ts-ignore
        dosimeterUIMesh.material.map.update();
    };

    React.useEffect(() => {
        updateDosimeterUI();
    }, []);

    useXREvent("squeeze", (event) => {
        console.log("Squeeze");

        updateDosimeterUI();
    });

    /*
    useFrame(() => {
        // @ts-ignore
        dosimeterUIMesh.material.map.update();
    });
    */

    return (
        <>
            <primitive
                object={group}
                {...props}
            />
            <primitive
                ref={ref}
                object={controls}
            />
        </>
    );
});
