import React from "react";
import * as THREE from "three";
import { useCursor, PivotControls } from "@react-three/drei";

import { IKControls as IKControlsImpl } from "../../../src";
import { useStore } from "../../store";

/**
 * PivotControlsProps
 * @link https://github.com/pmndrs/drei/blob/8a64fb79e9159b2f87504b18b8881199823b18d5/src/web/pivotControls/index.tsx
 */
type HandIKPivotControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<THREE.Object3D>;

    scale?: number;
    lineWidth?: number;
    fixed?: boolean;
    activeAxes?: [boolean, boolean, boolean];
    disableRotations?: boolean;
    opacity?: number;
    visible?: boolean;
};
export const HandIKPivotControls = React.forwardRef<
    IKControlsImpl,
    HandIKPivotControlsProps
>(function HandIKPivotControls(
    {
        object,
        children,
        scale = 0.75,
        lineWidth = 2,
        fixed = false,
        disableRotations = true,
        opacity = 1,
        visible = true,
        ...props
    },
    ref
) {
    const [set, viewing] = useStore((state) => [state.set, state.viewing]);

    const controls = React.useMemo(() => new IKControlsImpl(), []);
    const group = React.useRef<THREE.Group>(null);

    const pivotGroupRef = React.useRef<THREE.Group>(null!);
    const [leftMatrix, setLeftMatrix] = React.useState<THREE.Matrix4>(() => {
        let matrix = new THREE.Matrix4();
        matrix.setPosition(0.3, 0.5, 0);

        return matrix;
    });
    const [rightMatrix, setRightMatrix] = React.useState<THREE.Matrix4>(() => {
        let matrix = new THREE.Matrix4();
        matrix = matrix.setPosition(-0.3, 0.5, 0);
        matrix = matrix.makeRotationFromEuler(
            new THREE.Euler(0, Math.PI / 2, 0)
        );

        return matrix;
    });

    // Init
    React.useEffect(() => {
        if (object.current) {
            controls.attach(object.current);
        } else if (group.current) {
            controls.attach(group.current);
        }

        return () => {
            controls.detach();
        };
    }, [object, children, controls]);

    return (
        <>
            <primitive
                ref={ref}
                object={controls}
            />
            <group ref={group}>{children}</group>

            <group
                ref={pivotGroupRef}
                visible={!viewing && visible}
            >
                {/* Left Hand IK */}
                <PivotControls
                    scale={scale}
                    lineWidth={lineWidth}
                    fixed={fixed}
                    disableRotations={disableRotations}
                    opacity={opacity}
                    matrix={new THREE.Matrix4().setPosition(0.3, 0.5, 0)}
                    onDragStart={() => console.log("Left Hand IK")}
                    onDrag={(l, deltaL, w, deltaW) => {
                        controls.setWorldPosition(
                            "mixamorigLeftHandIK",
                            new THREE.Vector3().setFromMatrixPosition(w)
                        );
                    }}
                    onDragEnd={() => {
                        // set execute log for experiment
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    avatar: {
                                        ...state.sceneStates.executeLog.avatar,
                                        leftHand: true,
                                    },
                                },
                            },
                        }));
                    }}
                />

                {/* Right Hand IK */}
                <PivotControls
                    scale={scale}
                    lineWidth={lineWidth}
                    fixed={fixed}
                    disableRotations={disableRotations}
                    opacity={opacity}
                    matrix={new THREE.Matrix4()
                        .makeRotationFromEuler(
                            new THREE.Euler(0, -Math.PI / 2, 0)
                        )
                        .setPosition(-0.3, 0.5, 0)}
                    axisColors={["#2080ff", "#20df80", "#ff2060"]}
                    onDragStart={() => console.log("Right Hand IK")}
                    onDrag={(l, deltaL, w, deltaW) => {
                        controls.setWorldPosition(
                            "mixamorigRightHandIK",
                            new THREE.Vector3().setFromMatrixPosition(w)
                        );
                    }}
                    onDragEnd={() => {
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    avatar: {
                                        ...state.sceneStates.executeLog.avatar,
                                        rightHand: true,
                                    },
                                },
                            },
                        }));
                    }}
                />
            </group>
        </>
    );
});
