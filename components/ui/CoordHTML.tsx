import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import { useStore } from "../../components/store";

import styles from "../../styles/css/coordHtml.module.css";

type Data = {
    position: string;
    rotation: string;
    distance: string;
};

export type CoordHTMLProps = {
    origin?: React.RefObject<THREE.Group> | React.RefObject<THREE.Mesh> | THREE.Vector3;
    enablePosition?: boolean;
    enableRotation?: boolean;
    enableDistance?: boolean;
    xzPlane?: boolean;
};
export function CoordHTML({
    origin,
    enablePosition = true,
    enableRotation = true,
    enableDistance = true,
    xzPlane = false,
    ...props
}: CoordHTMLProps) {
    const [annotations] = useStore((state) => [state.annotations]);

    const ref = React.useRef<THREE.Group>(null!);
    const [data, setData] = React.useState<Data>({ position: "", rotation: "", distance: "" });
    const [originPosition, setOriginPosition] = React.useState<THREE.Vector3>(new THREE.Vector3());

    React.useEffect(() => {
        const _position = new THREE.Vector3();

        if (origin) {
            if (origin instanceof THREE.Vector3) {
                _position.copy(origin);
            } else if (origin.current) {
                _position.setFromMatrixPosition(origin.current.matrixWorld);
            } else {
            }
        }

        setOriginPosition(_position);
    }, [origin]);

    useFrame(() => {
        const _position = new THREE.Vector3().setFromMatrixPosition(ref.current.matrixWorld);

        const _rotationArray = new THREE.Vector3()
            .setFromEuler(new THREE.Euler().setFromRotationMatrix(ref.current.matrixWorld))
            .multiplyScalar(180.0 / Math.PI)
            .toArray()
            .map((value) => (value < 0 ? 360.0 + value : value));
        const _rotation = new THREE.Vector3().fromArray(_rotationArray);

        const _distanceVector = new THREE.Vector3().subVectors(_position, originPosition);
        if (xzPlane) {
            _distanceVector.setY(0);
        }

        setData({
            position: `${_position.x.toFixed(1)}, ${_position.y.toFixed(1)}, ${_position.z.toFixed(
                1
            )}`,
            rotation: `${_rotation.x.toFixed(1)}, ${_rotation.y.toFixed(1)}, ${_rotation.z.toFixed(
                1
            )}`,
            distance: `${_distanceVector.length().toFixed(2)}`,
        });
    });

    return (
        <>
            <group ref={ref}>
                {annotations ? (
                    <Html distanceFactor={undefined}>
                        <div className={`${styles.foundation}`}>
                            <div className={`${styles.content}`}>
                                {enablePosition ? (
                                    <div className={`${styles.item}`}>
                                        <div className={`${styles.label}`}>Position</div>
                                        <div className={`${styles.data}`}>{data.position}</div>
                                    </div>
                                ) : null}
                                {enableRotation ? (
                                    <div className={`${styles.item}`}>
                                        <div className={`${styles.label}`}>Rotation</div>
                                        <div className={`${styles.data}`}>{data.rotation}</div>
                                    </div>
                                ) : null}
                                {enableDistance && origin ? (
                                    <div className={`${styles.item}`}>
                                        <div className={`${styles.label}`}>Distance</div>
                                        <div className={`${styles.data}`}>{data.distance}</div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Html>
                ) : null}
            </group>
        </>
    );
}
