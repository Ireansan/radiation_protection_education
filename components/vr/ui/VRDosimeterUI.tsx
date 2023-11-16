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
        [gl, camera],
    );
    const dosimeterUIMesh = React.useMemo(() => {
        const dosimeterUI = document.getElementById(
            "DosimeterUI",
        ) as HTMLElement;
        dosimeterUI.style.height = `${5 * 60 + 30}px`;

        const dosimeterUIMesh = new HTMLMesh(dosimeterUI);
        group.add(dosimeterUIMesh);

        return dosimeterUIMesh;
    }, [group]);

    React.useEffect(() => {
        dosimeterUIMesh.position.set(-0.4, -0.3, -2);
        dosimeterUIMesh.scale.setScalar(3);
        dosimeterUIMesh.lookAt(0, 0, 0);

        camera.add(dosimeterUIMesh);
    }, [camera, dosimeterUIMesh]);

    useFrame(() => {
        // @ts-ignore
        dosimeterUIMesh.material.map.update();
    });

    return <></>;
}
