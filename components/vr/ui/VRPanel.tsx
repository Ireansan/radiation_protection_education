import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
// import { GUI } from "lil-gui";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRPanle({ ...props }: JSX.IntrinsicElements["group"]) {
    const parameters = {
        radius: 0.6,
        tube: 0.2,
        tubularSegments: 150,
        radialSegments: 20,
        p: 2,
        q: 3,
        thickness: 0.5,
    };

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );

    const ref = React.useRef<THREE.Mesh>(null!);

    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            gui.add(ref.current.position, "x", 0.0).onChange(
                (value: number) => {
                    console.log(value);
                    ref.current.position.x = value;
                }
            );
            gui.add(ref.current.position, "y", 0.0);
            gui.add(ref.current.position, "z", 0.0);
            // gui.add(ref.current, "scale", 0, 1);
            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

    return (
        <>
            <primitive object={group} {...props} />

            <mesh ref={ref}>
                <torusKnotBufferGeometry args={[0.6, 0.2, 150, 20]} />
                <meshBasicMaterial color={"red"} />
            </mesh>
        </>
    );
}
