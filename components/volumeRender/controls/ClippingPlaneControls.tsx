import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";

import { typeConfigStates } from "../../../lib/states/volumeRender.Controls.state";
import clippingPlaneStore from "../../../lib/states/clippingPlane.state";

/** */
const degreeToRad = (d: number): number => {
    return (Math.PI / 180) * d;
};

/** */
function ClippingPlaneControls() {
    const { plane, setPosition, setMatrix, setPlane } = clippingPlaneStore();

    const planeHelperRef = useRef<THREE.PlaneHelper>(
        new THREE.PlaneHelper(new THREE.Plane())
    );
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());

    const planeConfig = useControls("plane", {
        position: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const position_ = new THREE.Vector3(e.x, e.y, e.z);

                setPosition(position_);
                setPlane();

                meshRef.current.position.copy(position_);
                typeConfigStates.controlsStates.position.copy(position_);
            },
            step: 1,
        },
        rotation: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const rotation_ = new THREE.Euler(
                    degreeToRad(e.x),
                    degreeToRad(e.y),
                    degreeToRad(e.z)
                );

                const matrix_ = new THREE.Matrix4();
                matrix_.makeRotationFromEuler(rotation_);

                setMatrix(matrix_);
                setPlane();

                meshRef.current.rotation.copy(rotation_);
                typeConfigStates.controlsStates.rotation.copy(rotation_);
            },
            step: 1,
        },
    });

    useEffect(() => {
        planeHelperRef.current.plane = plane;
        planeHelperRef.current.size = 250;
    });

    return (
        <>
            <planeHelper ref={planeHelperRef} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

export default ClippingPlaneControls;
