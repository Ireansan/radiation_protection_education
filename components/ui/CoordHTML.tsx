import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import styles from "../../styles/css/coordHtml.module.css";

export type CoordHTMLProps = {
    origin?: React.RefObject<THREE.Object3D> | THREE.Vector3;
};
export function CoordHTML({ origin, ...props }: CoordHTMLProps) {
    const ref = React.useRef<THREE.Group>(null!);
    const [position, setPosition] = React.useState<THREE.Vector3>(new THREE.Vector3());
    const [rotation, setRotation] = React.useState<THREE.Vector3>(new THREE.Vector3());
    const originWorldPosition = React.useMemo(() => {
        const _position = new THREE.Vector3();
        if (!origin) {
            return _position;
        }

        if (origin instanceof THREE.Vector3) {
            return origin;
        } else if (origin.current) {
            return _position.setFromMatrixPosition(origin.current.matrixWorld);
        } else {
            return _position;
        }
    }, [origin]);

    useFrame(() => {
        const _position = new THREE.Vector3().setFromMatrixPosition(ref.current.matrixWorld);
        setPosition(_position);

        const _rotationArray = new THREE.Vector3()
            .setFromEuler(new THREE.Euler().setFromRotationMatrix(ref.current.matrixWorld))
            .multiplyScalar(180.0 / Math.PI)
            .toArray()
            .map((value) => (value < 0 ? 360.0 + value : value));
        const _rotation = new THREE.Vector3().fromArray(_rotationArray);
        setRotation(_rotation);
    });

    return (
        <>
            <group ref={ref}>
                <Html distanceFactor={undefined}>
                    <div className={`${styles.foundation}`}>
                        <div className={`${styles.content}`}>
                            {position.x.toFixed(1)}, {position.y.toFixed(1)},{" "}
                            {position.z.toFixed(1)} <br />
                            {rotation.x.toFixed(1)}, {rotation.y.toFixed(1)},{" "}
                            {rotation.z.toFixed(1)} <br />
                            {origin ? position.distanceTo(originWorldPosition) : ""}
                        </div>
                    </div>
                </Html>
            </group>
        </>
    );
}
