import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useThree, useFrame } from "@react-three/fiber";
import {
    CapsuleCollider,
    RigidBody,
    RigidBodyApi,
    useRapier,
} from "@react-three/rapier";

import { getState, useStore } from "../store";
import type { Controls } from "../store";

import { AnimationStates } from "../controls";

export type playerProps = {
    children: React.ReactNode;
};
export function Player({
    children,
    ...props
}: playerProps & JSX.IntrinsicElements["group"]) {
    // Base
    const [cameraMode, editor, playerConfig] = useStore((state) => [
        state.camera,
        state.editor,
        state.playerConfig,
    ]);
    const { set } = useStore(({ set }) => ({
        set,
    }));

    const { radius, halfHeight, moveSpeed, boost, cameraDistance } =
        playerConfig;

    // Animation
    const { mixer, ref } = AnimationStates();

    // RigidBody
    const rigidBody = useRef<RigidBodyApi>(null);
    const rapier = useRapier();
    const { camera } = useThree();

    let controls: Controls;
    let isBoosting = false;
    let maxToi = 5.0;
    let solid = false;

    // Movement
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // Plyaer
    const rigidbodyPosition = new THREE.Vector3();
    const playerPosition = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();
    const playerRotation = new THREE.Euler();
    const refDirection = useRef<THREE.Vector3>(new THREE.Vector3());

    // Mouse
    const pointerActiveRef = useRef<boolean>(false);
    const onPointerDown = (event: Event) => {
        pointerActiveRef.current = true;
    };
    const onPointerUp = (event: Event) => {
        pointerActiveRef.current = false;
    };

    useEffect(() => {
        window.document.addEventListener("pointerdown", onPointerDown);
        window.document.addEventListener("pointerup", onPointerUp);

        return () => {
            window.document.removeEventListener("pointerdown", onPointerDown);
            window.document.removeEventListener("pointerup", onPointerUp);
        };
    }, []);

    useFrame((state, delta) => {
        controls = getState().controls;
        const { forward, backward, left, right, jump } = controls;
        isBoosting = controls.boost;

        if (rigidBody.current) {
            // update group position, rotation
            const velocity = rigidBody.current.linvel();
            rigidbodyPosition.copy(rigidBody.current.translation());

            playerPosition.copy(rigidbodyPosition);
            playerPosition.y -= radius + halfHeight;

            playerDirection.set(0, 0, 1);
            if (pointerActiveRef.current) {
                playerDirection
                    .applyEuler(camera.rotation)
                    .setY(0)
                    .multiplyScalar(-1);
                refDirection.current.copy(playerDirection);
            } else {
                playerDirection.copy(refDirection.current);
            }
            playerDirection.add(playerPosition);

            if (ref.current) {
                ref.current.position.copy(playerPosition);

                if (!editor) {
                    ref.current.lookAt(playerDirection);
                }

                playerRotation.copy(ref.current.rotation);
            }

            // update camera
            if (!editor) {
                const headPosition = new THREE.Vector3().copy(
                    rigidbodyPosition
                );
                headPosition.y += halfHeight;

                if (cameraMode === "FIRST_PERSON") {
                    camera.position.copy(headPosition);
                } else if (cameraMode === "THIRD_PERSON") {
                    const cameraPositionOffset = new THREE.Vector3();
                    camera.getWorldDirection(cameraPositionOffset);
                    cameraPositionOffset.setLength(cameraDistance);

                    camera.position.subVectors(
                        headPosition,
                        cameraPositionOffset
                    );
                }
            }

            // movement
            frontVector.set(0, 0, Number(backward) - Number(forward));
            sideVector.set(Number(left) - Number(right), 0, 0);
            direction
                .subVectors(frontVector, sideVector)
                .normalize()
                .multiplyScalar(moveSpeed * (isBoosting ? boost : 1));
            if (!editor) {
                direction.applyEuler(playerRotation).multiplyScalar(-1);
            }
            rigidBody.current.setLinvel({
                x: direction.x,
                y: velocity.y,
                z: direction.z,
            });

            // jumping
            const world = rapier.world.raw();
            const ray = world.castRay(
                new RAPIER.Ray(rigidBody.current.translation(), {
                    x: 0,
                    y: -1,
                    z: 0,
                }),
                maxToi,
                solid
            );
            const grounded: boolean = ray
                ? ray.collider && Math.abs(ray.toi) <= radius + halfHeight
                : false;
            if (jump && grounded) {
                rigidBody.current.setLinvel({ x: 0, y: 10, z: 0 });
            }

            set((state) => ({ controls: { ...state.controls, grounded } }));
        }

        mixer.update(delta);
    });

    return (
        <>
            <RigidBody
                ref={rigidBody}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 10, 0]}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[halfHeight, radius]} />
            </RigidBody>

            {/* @ts-ignore */}
            <group ref={ref}>{children}</group>
        </>
    );
}
