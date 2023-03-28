import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMatcapTexture } from "@react-three/drei";
import * as THREE from "three";

import { matcapList, useStore } from "../store";

type matcapBoxProps = {
    matcapID: number;
    rotateOffset?: number;
};
export function MatcapBox({
    matcapID,
    rotateOffset = Math.PI / 10e2,
    ...props
}: matcapBoxProps & JSX.IntrinsicElements["mesh"]) {
    const ref = useRef<THREE.Mesh>(null!);

    const [Matcap] = useMatcapTexture(matcapID, 512);

    useFrame((state, delta) => {
        ref.current.rotation.x =
            ref.current.rotation.y =
            ref.current.rotation.z +=
                rotateOffset;
    });

    return (
        <mesh ref={ref} {...props}>
            <boxGeometry />
            <meshMatcapMaterial attach="material" matcap={Matcap} />
        </mesh>
    );
}

type matcapSelectProps = {
    onClickFunction?: (event: THREE.Event, matcapID: any) => void;
};
export function MatcapSelect({
    onClickFunction = (event, matcapID) => {},
    ...props
}: matcapSelectProps & JSX.IntrinsicElements["group"]) {
    const groupRef = useRef<THREE.Group>(null!);

    return (
        <group ref={groupRef} {...props}>
            <>
                {matcapList.map((v, i) => (
                    <>
                        <MatcapBox
                            matcapID={v}
                            position={[
                                (i % 5) * 1.5,
                                (Math.floor(matcapList.length / 5) -
                                    Math.floor(i / 5)) *
                                    1.5,
                                0,
                            ]}
                            onClick={(event) => {
                                onClickFunction(event, v);
                            }}
                        />
                    </>
                ))}
            </>
        </group>
    );
}

export function BodyMatcapSelect({ ...props }: JSX.IntrinsicElements["group"]) {
    const [get, set] = useStore((state) => [state.get, state.set]);

    const onClick = (event: THREE.Event, matcapID: any) => {
        set({
            playerConfig: {
                ...get().playerConfig,
                bodyMatcap: matcapID,
            },
        });
    };

    return <MatcapSelect onClickFunction={onClick} {...props} />;
}

export function JointMatcapSelect({
    ...props
}: JSX.IntrinsicElements["group"]) {
    const [get, set] = useStore((state) => [state.get, state.set]);

    const onClick = (event: THREE.Event, matcapID: any) => {
        set({
            playerConfig: {
                ...get().playerConfig,
                jointMatcap: matcapID,
            },
        });
    };

    return <MatcapSelect onClickFunction={onClick} {...props} />;
}
