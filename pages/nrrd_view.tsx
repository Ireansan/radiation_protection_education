/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useMemo, useLayoutEffect } from "react";

import { useFrame, Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "./jsm/loaders/NRRDLoader";

import styles from "../styles/nrrd_view.module.css";
import { volumeRenderStates } from "./states/nrrd_view.states";
import { volumeRenderShader } from "./shaders/volumeShader";

type volumeArgs = {
    clim1: number;
    clim2: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
};
function NRRDTest({
    clim1,
    clim2,
    colormap,
    renderstyle,
    isothreshold,
}: volumeArgs) {
    const geometryRef = useRef<THREE.BoxGeometry>(new THREE.BoxGeometry());
    const materialRef = useRef<THREE.ShaderMaterial>(
        new THREE.ShaderMaterial()
    );

    // Load nrrd
    var filepaths = [
        "/models/nrrd/stent.nrrd",
        "/models/nrrd/dose_106_200_290.nrrd",
        "/models/nrrd/dose_d100.nrrd",
    ];
    // const volume: any = useLoader(NRRDLoader, filepaths[2]);
    const volume: any = useLoader(NRRDLoader, filepaths[0]);

    const cmtextures = useMemo(() => {
        // Colormap textures
        const cmtextures = [
            new THREE.TextureLoader().load("textures/cm_viridis.png"),
            new THREE.TextureLoader().load("textures/cm_gray.png"),
        ];
        //     console.log("useMemo");

        return cmtextures;
    }, []);

    // useLayoutEffect(() => {
    const uniforms = useMemo(() => {
        const uniforms = THREE.UniformsUtils.clone(volumeRenderShader.uniforms);
        // Texture
        const texture = new THREE.Data3DTexture(
            volume.data,
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;
        console.log(texture, volume.xLength, volume.yLength, volume.zLength);

        // Material
        uniforms.u_data = { value: texture };
        uniforms.u_size = {
            value: new THREE.Vector3(
                volume.xLength,
                volume.yLength,
                volume.zLength
            ),
        };
        uniforms.u_clim = {
            value: new THREE.Vector2(clim1, clim2),
        };
        uniforms.u_renderstyle = {
            value: renderstyle === "mip" ? 0 : 1,
        }; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold = {
            value: isothreshold,
        }; // For ISO renderstyle
        uniforms.u_cmdata = { value: cmtextures[colormap] };

        // Geometry
        geometryRef.current = new THREE.BoxGeometry(
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
        geometryRef.current.translate(
            volume.xLength / 2 - 0.5,
            volume.yLength / 2 - 0.5,
            volume.zLength / 2 - 0.5
        );

        console.log("useMemo");
        console.log(materialRef.current);

        return uniforms;
    }, [volume, cmtextures, clim1, clim2, colormap, renderstyle, isothreshold]);
    //     console.log("useLayoutEffect");
    // }, []);

    useFrame((state) => {
        // /*
        materialRef.current.uniforms.u_clim.value = new THREE.Vector2(
            clim1,
            clim2
        );
        materialRef.current.uniforms.u_renderstyle.value =
            renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
        materialRef.current.uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        materialRef.current.uniforms.u_cmdata.value = cmtextures[colormap];
        // */
        /*
        console.log(
            "frame",
            clim1,
            clim2,
            colormap,
            renderstyle,
            isothreshold,
            materialRef.current.uniforms.u_data,
            materialRef.current.uniforms.u_clim,
            materialRef.current.uniforms.u_renderstyle,
            materialRef.current.uniforms.u_renderthreshold,
            materialRef.current.uniforms.u_cmdata
        );
         */
    });

    return (
        <>
            {console.log(
                "return",
                materialRef.current.uniforms.u_data,
                materialRef.current.uniforms.u_clim,
                materialRef.current.uniforms.u_renderstyle,
                materialRef.current.uniforms.u_renderthreshold,
                materialRef.current.uniforms.u_cmdata
            )}
            <mesh>
                <boxGeometry attach="geometry" ref={geometryRef} />
                <shaderMaterial
                    attach="material"
                    ref={materialRef}
                    // uniforms={volumeRenderShader.uniforms}
                    uniforms={uniforms}
                    vertexShader={volumeRenderShader.vertexShader}
                    fragmentShader={volumeRenderShader.fragmentShader}
                />
            </mesh>
        </>
    );
}

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function NRRDView() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();

    const { volume, clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volumeRenderStates);

    // Load nrrd
    /*
    var filepaths = [
        "/models/nrrd/stent.nrrd",
        "/models/nrrd/dose_106_200_290.nrrd",
        "/models/nrrd/dose_d100.nrrd",
    ];
    console.log(filepaths[2]);
    const tmpVolume: any = useLoader(NRRDLoader, filepaths[2]);
    useEffect(() => {
        volumeRenderStates.volume = tmpVolume;
    }, []);
    */

    const [volumeConfig, volumeSet] = useControls(() => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim2 = e;
            },
        },
        colormap: {
            options: ["viridis", "gray"],
            onChange: (e) => {
                if (e === "viridis") {
                    volumeRenderStates.colormap = 0;
                } else if (e === "gray") {
                    volumeRenderStates.colormap = 1;
                }
            },
        },
        renderstyle: {
            options: ["iso", "mip"],
            onChange: (e) => {
                volumeRenderStates.renderstyle = e;
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            // max: 100,
            onChange: (e) => {
                volumeRenderStates.isothreshold = e;
            },
        },
    }));

    useEffect(() => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.copy(
            new THREE.OrthographicCamera(
                (-h * aspect) / 2,
                (h * aspect) / 2,
                h / 2,
                -h / 2,
                1,
                1000
            )
        );
        camera.position.set(-64, -64, 128);
        camera.up.set(0, 0, 1); // In our data, z is up
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <NRRDTest
                        clim1={clim1}
                        clim2={clim2}
                        colormap={colormap}
                        renderstyle={renderstyle}
                        isothreshold={isothreshold}
                    />
                    <OrbitControls />

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default NRRDView;
