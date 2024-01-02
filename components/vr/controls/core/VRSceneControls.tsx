import React from "react";
import { useThree } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";

export type VRSceneControlsProps = {
    typeNum: number;
    onChange: (e: number) => void;
} & JSX.IntrinsicElements["group"];
export function VRSceneControls({
    typeNum,
    onChange,
    ...props
}: VRSceneControlsProps) {
    const parameters = {
        type: 1,
    };

    /**
     * lil-gui
     */
    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            const folder = gui.addFolder("Gimmick");
            folder
                .add(parameters, "type")
                .min(1)
                .max(typeNum)
                .step(1)
                .name("type")
                .onChange((n: number) => {
                    onChange(n);
                });

            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );

    return (
        <>
            <primitive
                object={group}
                {...props}
            />
        </>
    );
}
