import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PivotControls } from "@react-three/drei";

import { Dosimeter } from "../../../src";
import { useStore } from "../../../components/store";

export type PlayerPivotControlsProps = {
    playerRef: React.RefObject<THREE.Group>;
    dosimeterRef: React.RefObject<Dosimeter>;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: number;
    fixed?: boolean;
    activeAxes?: [boolean, boolean, boolean];
};
export function PlayerPivotControls({
    playerRef,
    dosimeterRef,
    position = new THREE.Vector3(),
    rotation = new THREE.Euler(),
    scale = 1,
    fixed = false,
    activeAxes = [true, true, true],
    ...props
}: PlayerPivotControlsProps) {
    const [set, viewing, objectVisibles] = useStore((state) => [
        state.set,
        state.viewing,
        state.sceneStates.objectVisibles,
    ]);

    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4().compose(
            position,
            new THREE.Quaternion().setFromEuler(rotation),
            new THREE.Vector3(1, 1, 1)
        )
    );

    const pivotRef = React.useRef<THREE.Group>(null!);

    useFrame(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                playerState: {
                    ...state.sceneStates.playerState,
                    position: playerRef.current
                        ? playerRef.current.position
                        : new THREE.Vector3(),
                    quaternion: playerRef.current
                        ? playerRef.current.quaternion
                        : new THREE.Quaternion(),
                },
            },
        }));
    });

    return (
        <PivotControls
            ref={pivotRef}
            matrix={matrix}
            scale={scale}
            fixed={fixed}
            activeAxes={activeAxes}
            visible={
                !viewing && objectVisibles.player && objectVisibles.playerPivot
            }
            onDrag={(l, deltaL, w, deltaW) => {
                if (playerRef.current) {
                    playerRef.current.position.setFromMatrixPosition(w);
                    playerRef.current.rotation.setFromRotationMatrix(w);
                }
            }}
            onDragEnd={() => {
                if (dosimeterRef.current) {
                    dosimeterRef.current.updateResults();
                }

                set((state) => ({
                    sceneStates: {
                        ...state.sceneStates,
                        executeLog: {
                            ...state.sceneStates.executeLog,
                            player: {
                                ...state.sceneStates.executeLog.player,
                                translate: true,
                            },
                        },
                    },
                }));
            }}
        />
    );
}
