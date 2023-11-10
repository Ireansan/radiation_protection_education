import React from "react";
import { useController } from "@react-three/xr";

import { IKControls as IKControlsImpl } from "../../../../src";
import { useFrame } from "@react-three/fiber";

type VRHandIKControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<THREE.Object3D>;
};
export const VRHandIKControls = React.forwardRef<
    IKControlsImpl,
    VRHandIKControlsProps
>(function VRHandIKControls({ children, object }, ref) {
    const controls = React.useMemo(() => new IKControlsImpl(), []);
    const group = React.useRef<THREE.Group>(null);
    const leftController = useController("left");
    const rightController = useController("right");

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

    useFrame(() => {
        // Left Hand
        if (leftController) {
            const { grip: controller } = leftController;

            controls.setWorldPosition(
                "mixamorigLeftHandIK",
                controller.position,
            );
        }

        // Right Hand
        if (rightController) {
            const { grip: controller } = rightController;

            controls.setWorldPosition(
                "mixamorigRightHandIK",
                controller.position,
            );
        }
    });

    return (
        <>
            <primitive ref={ref} object={controls} />
            <group ref={group}>{children}</group>
        </>
    );
});
