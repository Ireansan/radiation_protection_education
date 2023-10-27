import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRDosimeterUI({ ...props }: JSX.IntrinsicElements["group"]) {
    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );
    const dosimeterUIMesh = React.useMemo(() => {
        const dosimeterUI = document.getElementById(
            "DosimeterUI"
        ) as HTMLElement;
        dosimeterUI.style.height = `${5 * 60 + 30}px`;

        const dosimeterUIMesh = new HTMLMesh(dosimeterUI);
        group.add(dosimeterUIMesh);

        return dosimeterUIMesh;
    }, [group]);

    useFrame(() => {
        // @ts-ignore
        dosimeterUIMesh.material.map.update();
    });

    return (
        <>
            <primitive object={group} {...props} />
        </>
    );
}
