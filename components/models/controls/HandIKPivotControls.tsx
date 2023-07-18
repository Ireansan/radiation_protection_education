import React from "react";
import * as THREE from "three";
import { useCursor, PivotControls } from "@react-three/drei";

import { IKControls as IKControlsImpl } from "../../../src";

type HandIKPivotControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<THREE.Object3D>;
};
export const HandIKPivotControls = React.forwardRef<
    IKControlsImpl,
    HandIKPivotControlsProps
>(function HandIKPivotControls({ object, children, ...props }, ref) {
    const controls = React.useMemo(() => new IKControlsImpl(), []);
    const group = React.useRef<THREE.Group>(null);

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

            {/* Left Hand IK */}
            <PivotControls
                scale={0.25}
                matrix={new THREE.Matrix4().setPosition(0.3, 0.5, 0)}
                onDragStart={() => console.log("Left Hand IK")}
                onDrag={(l, deltaL, w, deltaW) => {
                    controls.setWorldPosition(
                        "mixamorigLeftHandIK",
                        new THREE.Vector3().setFromMatrixPosition(w)
                    );
                }}
            />

            {/* Right Hand IK */}
            <PivotControls
                scale={0.25}
                matrix={new THREE.Matrix4().setPosition(-0.3, 0.5, 0)}
                onDragStart={() => console.log("Right Hand IK")}
                onDrag={(l, deltaL, w, deltaW) => {
                    controls.setWorldPosition(
                        "mixamorigRightHandIK",
                        new THREE.Vector3().setFromMatrixPosition(w)
                    );
                }}
            />
        </>
    );
});
