import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useController, useXREvent } from "@react-three/xr";

import { IKControls as IKControlsImpl } from "../../../../src";
import { useStore } from "../../../store";

type VRHandIKControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object?: React.RefObject<THREE.Object3D>;
};
export const VRHandIKControls = React.forwardRef<
    IKControlsImpl,
    VRHandIKControlsProps
>(function VRHandIKControls({ children, object }, ref) {
    const [debug, follow, set] = useStore((state) => [
        state.debug,
        state.follow,
        state.set,
    ]);

    const { scene } = useThree();
    const leftController = useController("left");
    const rightController = useController("right");

    const controls = React.useMemo(() => new IKControlsImpl(), []);
    const group = React.useRef<THREE.Group>(null);

    // Init
    React.useEffect(() => {
        const player = scene.getObjectByName("VRCustomYBotIK");

        if (object && object.current) {
            controls.attach(object.current);
        } else if (group.current) {
            controls.attach(group.current);
        } else if (player) {
            controls.attach(player);
        }

        return () => {
            controls.detach();
        };
    }, [scene, controls]);

    useXREvent("squeeze", (event) => {
        console.log("Squeeze");
        set((state) => ({ follow: !state.follow }));
    });

    useFrame(() => {
        // Left Hand
        if (leftController && follow) {
            const { grip: controller } = leftController;

            controls.setWorldPosition(
                "mixamorigLeftHandIK",
                controller.position
            );
        }

        // Right Hand
        if (rightController && follow) {
            const { grip: controller } = rightController;

            controls.setWorldPosition(
                "mixamorigRightHandIK",
                controller.position
            );
        }
    });

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
