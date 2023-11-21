import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useControls, folder } from "leva";

export function CustomOrbitControls({ ...props }) {
    const ref = React.useRef<OrbitControlsImpl>(null!);

    const [,] = useControls(() => ({
        Scene: folder({
            Config: folder({
                "Camera Controls": folder({
                    enableDamping: {
                        value: false,
                        onChange: (e) => {
                            ref.current.enableDamping = e;
                        },
                    },
                    dampingFactor: {
                        value: 0.05,
                        step: 0.01,
                        onChange: (e) => {
                            ref.current.dampingFactor = e;
                        },
                        render: () => ref.current.enableDamping,
                    },
                    panSpeed: {
                        value: 1,
                        onChange: (e) => {
                            ref.current.panSpeed = e;
                        },
                    },
                    rotateSpeed: {
                        value: 1,
                        onChange: (e) => {
                            ref.current.rotateSpeed = e;
                        },
                    },
                    zoomSpeed: {
                        value: 1,
                        onChange: (e) => {
                            ref.current.zoomSpeed = e;
                        },
                    },
                }),
            }),
        }),
    }));

    return (
        <>
            <OrbitControls ref={ref} makeDefault />
        </>
    );
}
