import React from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";

import { IKControls as IKControlsImpl } from "../../../src";
import { useStore } from "../../store";

type HandIKLevaControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<THREE.Object3D>;
};
export const HandIKLevaControls = React.forwardRef<
    IKControlsImpl,
    HandIKLevaControlsProps
>(function HandIKLevaControls({ object, children, ...props }, ref) {
    const [set] = useStore((state) => [state.set]);

    const controls = React.useMemo(() => new IKControlsImpl(), []);
    const group = React.useRef<THREE.Group>(null);

    const [LeftIKPosition, setLeftIKPosition] = React.useState({
        init: new THREE.Vector3(0.3, 0.8, 0),
        data: new THREE.Vector3(0.3, 0.8, 0),
    });
    const [RightIKPosition, setRightIKPosition] = React.useState({
        init: new THREE.Vector3(-0.3, 0.8, 0),
        data: new THREE.Vector3(-0.3, 0.8, 0),
    });

    const [ikConfig, setIK] = useControls(() => ({
        Player: folder(
            {
                Hand: folder({
                    left: {
                        value: { x: 0, y: 0 },
                        min: 0,
                        max: 1,
                        label: "left",
                        joystick: "invertY",
                        onChange: (e) => {
                            let position = LeftIKPosition.data.clone();
                            position.setZ(0.6 * e.x + LeftIKPosition.init.z);
                            position.setY(0.7 * e.y + LeftIKPosition.init.y);

                            LeftIKPosition.data.copy(position);
                            controls.setLocalPosition(
                                "mixamorigLeftHandIK",
                                position
                            );
                        },
                        onEditEnd: () => {
                            // set execute log for experiment
                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    executeLog: {
                                        ...state.sceneStates.executeLog,
                                        player: {
                                            ...state.sceneStates.executeLog
                                                .player,
                                            leftHand: true,
                                        },
                                    },
                                },
                            }));
                        },
                    },
                    right: {
                        value: { x: 0, y: 0 },
                        min: 0,
                        max: 1,
                        label: "right",
                        joystick: "invertY",
                        onChange: (e) => {
                            let position = RightIKPosition.data.clone();
                            position.setZ(0.6 * e.x + RightIKPosition.init.z);
                            position.setY(0.7 * e.y + RightIKPosition.init.y);

                            RightIKPosition.data.copy(position);
                            controls.setLocalPosition(
                                "mixamorigRightHandIK",
                                position
                            );
                        },
                        onEditEnd: () => {
                            // set execute log for experiment
                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    executeLog: {
                                        ...state.sceneStates.executeLog,
                                        player: {
                                            ...state.sceneStates.executeLog
                                                .player,
                                            rightHand: true,
                                        },
                                    },
                                },
                            }));
                        },
                    },
                }),
            }
            // { collapsed: true }
        ),
    }));

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
        </>
    );
});
