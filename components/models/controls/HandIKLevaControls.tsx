import React from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";

import { IKControls as IKControlsImpl } from "../../../src";

type HandIKLevaControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<THREE.Object3D>;
};
export const HandIKLevaControls = React.forwardRef<
    IKControlsImpl,
    HandIKLevaControlsProps
>(function HandIKLevaControls({ object, children, ...props }, ref) {
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
        "Hand Position": folder({
            Left: folder({
                LeftDepth: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Depth",
                    onChange: (e) => {
                        let position = LeftIKPosition.data.clone();
                        position.setZ(0.6 * e + LeftIKPosition.init.z);

                        LeftIKPosition.data.copy(position);
                        controls.setLocalPosition(
                            "mixamorigLeftHandIK",
                            position
                        );
                    },
                },
                LeftHeight: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Height",
                    onChange: (e) => {
                        let position = LeftIKPosition.data.clone();
                        position.setY(0.7 * e + LeftIKPosition.init.y);

                        LeftIKPosition.data.copy(position);
                        controls.setLocalPosition(
                            "mixamorigLeftHandIK",
                            position
                        );
                    },
                },
            }),
            Right: folder({
                RightDepth: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Depth",
                    onChange: (e) => {
                        let position = RightIKPosition.data.clone();
                        position.setZ(0.6 * e + RightIKPosition.init.z);

                        RightIKPosition.data.copy(position);
                        controls.setLocalPosition(
                            "mixamorigRightHandIK",
                            position
                        );
                    },
                },
                RightHeight: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Height",
                    onChange: (e) => {
                        let position = RightIKPosition.data.clone();
                        position.setY(0.7 * e + RightIKPosition.init.y);

                        RightIKPosition.data.copy(position);
                        controls.setLocalPosition(
                            "mixamorigRightHandIK",
                            position
                        );
                    },
                },
            }),
        }),
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
            <primitive ref={ref} object={controls} />
            <group ref={group}>{children}</group>
        </>
    );
});
