import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
    CapsuleCollider,
    RigidBody,
    RigidBodyApi,
    useRapier,
} from "@react-three/rapier";

import { getState, useStore } from "../../store";
import type { Controls } from "../../store";

import { AnimationStates } from "../controls";

export type playerProps = {
    children: React.ReactNode;
};
export function Player({
    children,
    ...props
}: playerProps & JSX.IntrinsicElements["group"]) {
    // ====================
    // Variable
    // --------------------
    // Base
    const [cameraMode, editor, playerConfig] = useStore((state) => [
        state.camera,
        state.editor,
        state.playerConfig,
    ]);
    const { set } = useStore(({ set }) => ({
        set,
    }));
    const {
        radius,
        halfHeight,
        moveSpeed,
        boost,
        cameraDistance,
        cameraRotateSpeed,
        followCameraDirection,
    } = playerConfig;

    // --------------------
    // Camera control
    const orbitControlsRef = useRef<OrbitControlsImpl>(null!);

    // --------------------
    // Animation
    const { mixer, ref } = AnimationStates();

    // --------------------
    // RigidBody
    const rigidBody = useRef<RigidBodyApi>(null);
    const rapier = useRapier();
    const { camera, gl } = useThree();

    let controls: Controls;
    let isBoosting = false;
    let maxToi = 5.0;
    let solid = false;

    // --------------------
    // Movement
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // --------------------
    // Plyaer
    const rigidbodyPosition = new THREE.Vector3();
    const playerPosition = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();
    const playerRotation = new THREE.Euler();
    const refDirection = useRef<THREE.Vector3>(new THREE.Vector3());

    // --------------------
    // Mouse
    const pointerActiveRef = useRef<boolean>(false);

    // ====================
    // Hook
    useEffect(() => {
        if (!editor) {
            orbitControlsRef.current.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE,
            };
        } else {
            orbitControlsRef.current.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN,
            };
        }
    }, [editor]);

    useEffect(() => {
        orbitControlsRef.current.rotateSpeed = cameraRotateSpeed;
        console.log("Change cameraRotateSpeed");
    }, [cameraRotateSpeed]);
    useEffect(() => {
        /**
         * event.button
         * 0: Left
         * 2: Right
         */
        const onPointerDown = (event: PointerEvent) => {
            if (
                cameraMode === "FIRST_PERSON" ||
                (cameraMode === "THIRD_PERSON" &&
                    event.button === followCameraDirection)
            ) {
                pointerActiveRef.current = true;
            }

            gl.domElement.style.cursor = "none";
        };
        const onPointerUp = (event: PointerEvent) => {
            pointerActiveRef.current = false;

            gl.domElement.style.cursor = "auto";
        };

        window.document.addEventListener("pointerdown", onPointerDown);
        window.document.addEventListener("pointerup", onPointerUp);

        return () => {
            window.document.removeEventListener("pointerdown", onPointerDown);
            window.document.removeEventListener("pointerup", onPointerUp);
        };
    }, [cameraMode, followCameraDirection]);

    // ====================
    //
    useFrame((state, delta) => {
        controls = getState().controls;
        const { forward, backward, left, right, jump, operation } = controls;
        isBoosting = controls.boost;

        if (rigidBody.current) {
            const velocity = rigidBody.current.linvel();

            // calculate position
            rigidbodyPosition.copy(rigidBody.current.translation());

            playerPosition.copy(rigidbodyPosition);
            playerPosition.y -= radius + halfHeight;

            // calculate rotation
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

            // update position and rotation
            if (ref.current) {
                ref.current.position.copy(playerPosition);

                if (!editor) {
                    ref.current.lookAt(playerDirection);
                }

                playerRotation.copy(ref.current.rotation);
            }

            set((state) => ({
                playerProperties: {
                    ...state.playerProperties,
                    position: ref.current
                        ? ref.current.position
                        : new THREE.Vector3(),
                    quaternion: ref.current
                        ? ref.current.quaternion
                        : new THREE.Quaternion(),
                },
            }));

            // update camera
            if (!editor) {
                const headPosition = new THREE.Vector3().copy(
                    rigidbodyPosition
                );
                headPosition.y += halfHeight;

                const cameraTargetPosition = new THREE.Vector3();
                const cameraWorldDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraWorldDirection);

                if (cameraMode === "FIRST_PERSON") {
                    camera.position.copy(headPosition);

                    cameraTargetPosition.addVectors(
                        headPosition,
                        cameraWorldDirection
                    );
                } else if (cameraMode === "THIRD_PERSON") {
                    const cameraPositionOffset = new THREE.Vector3()
                        .copy(cameraWorldDirection)
                        .setLength(cameraDistance);

                    camera.position.subVectors(
                        headPosition,
                        cameraPositionOffset
                    );

                    cameraTargetPosition.copy(headPosition);
                }

                orbitControlsRef.current.target.set(
                    cameraTargetPosition.x,
                    cameraTargetPosition.y,
                    cameraTargetPosition.z
                );
                orbitControlsRef.current.update();
            }

            orbitControlsRef.current.enableRotate = !operation;

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

            <OrbitControls ref={orbitControlsRef} makeDefault />
        </>
    );
}
