/* eslint-disable react/no-unknown-property */
/**
 * @link https://codesandbox.io/s/minecraft-vkgi6?file=/src/Ground.js
 */

import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";

const texturePath = "/textures/grass.jpg";
export function Ground({ ...props }: RigidBodyProps) {
    const texture = useTexture(texturePath);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <RigidBody {...props} type="fixed" colliders={false}>
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial
                    map={texture}
                    map-repeat={[240, 240]}
                    color="green"
                />
            </mesh>
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
    );
}
