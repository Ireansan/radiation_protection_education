import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
import Stats from "three/examples/jsm/libs/stats.module";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRDosimeterUI({ ...props }: JSX.IntrinsicElements["group"]) {
    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );
    const dosimeterUI = React.useMemo(
        () => document.getElementById("DosimeterUI"),
        []
    );

    React.useEffect(() => {
        const dosimeterUIMesh = new HTMLMesh(dosimeterUI as HTMLElement);
        group.add(dosimeterUIMesh);
    }, []);

    return (
        <>
            <primitive object={group} {...props} />
        </>
    );
}
