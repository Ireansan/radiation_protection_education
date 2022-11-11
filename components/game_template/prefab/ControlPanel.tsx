/**
 * @link https://codesandbox.io/s/7ucso?file=/src/App.js
 * @link https://codesandbox.io/s/leva-advanced-panels-w3f2w
 * @link https://codesandbox.io/s/leva-custom-plugin-l4xmm?file=/src/App.tsx
 */

import { useState } from "react";
import { Html } from "@react-three/drei";
import { Leva, LevaPanel, useControls, useCreateStore } from "leva";
import { Components } from "leva/plugin";

const { Row, Label, Number } = Components;

export function ControlPanel({ ...props }: JSX.IntrinsicElements["mesh"]) {
    const [size, set] = useState(0.5);
    const [hidden, setVisible] = useState(false);
    /*
    const [test, setTest] = useControls(() => ({
        size: {
            value: 1,
            min: 0,
            max: 5,
        },
    }));
    */
    const testStore = useCreateStore();
    const test = useControls(
        {
            size: {
                value: 1,
                min: 0,
                max: 5,
            },
        },
        { store: testStore }
    );

    const onOcclude = (visible: boolean) => {
        setVisible(visible);
        return null;
    };

    return (
        <mesh scale={test.size * 2} {...props}>
            <boxGeometry />
            <meshStandardMaterial />
            <Html
                style={{
                    transition: "all 0.2s",
                    opacity: hidden ? 0 : 1,
                    transform: `scale(${hidden ? 0.5 : 1})`,
                }}
                distanceFactor={1.5}
                position={[0, 0, 0.51]}
                transform
                occlude
                onOcclude={onOcclude}
            >
                <span>Size</span>
                <div
                    style={{
                        display: "grid",
                        width: 300,
                        gap: 10,
                        paddingBottom: 40,
                        overflow: "auto",
                        background: "#181C20",
                    }}
                >
                    <LevaPanel fill flat titleBar={false} store={testStore} />
                </div>
            </Html>
        </mesh>
    );
}
