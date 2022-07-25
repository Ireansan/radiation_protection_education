/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "./jsm/loaders/NRRDLoader";
import { VolumeRenderShader1 } from "./jsm/shaders/VolumeShader.js";

import styles from "../styles/nrrd_view.module.css";
import { volstate } from "./states/nrrd_view.states";

function NRRDTest() {
    const { clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volstate);

    const [volconfig, set] = useControls(() => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                volstate.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                volstate.clim2 = e;
            },
        },
        colormap: {
            options: ["viridis", "gray"],
            onChange: (e) => {
                if (e === "viridis") {
                    volstate.colormap = 0;
                } else if (e === "gray") {
                    volstate.colormap = 1;
                }
            },
        },
        renderstyle: {
            options: ["iso", "mip"],
            onChange: (e) => {
                volstate.renderstyle = e;
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            // max: 100,
            onChange: (e) => {
                volstate.isothreshold = e;
            },
        },
    }));

    // Load nrrd
    var filepaths = [
        "models/nrrd/stent.nrrd",
        "models/nrrd/dose_106_200_290.nrrd",
        "models/nrrd/dose_d100.nrrd",
    ];
    const volume: any = useLoader(NRRDLoader, filepaths[2]);
    console.log(volume);

    // Colormap textures
    const cmtextures = [
        new THREE.TextureLoader().load("textures/cm_viridis.png"),
        new THREE.TextureLoader().load("textures/cm_gray.png"),
    ];

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

    // Material
    const shader = VolumeRenderShader1;

    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["u_data"].value = texture;
    uniforms["u_size"].value.set(
        volume.xLength,
        volume.yLength,
        volume.zLength
    );
    uniforms["u_clim"].value.set(clim1, clim2);
    uniforms["u_renderstyle"].value = renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
    uniforms["u_renderthreshold"].value = isothreshold; // For ISO renderstyle
    uniforms["u_cmdata"].value = cmtextures[colormap];

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
    });

    const geometry = new THREE.BoxGeometry(
        volume.xLength,
        volume.yLength,
        volume.zLength
    );
    geometry.translate(
        volume.xLength / 2 - 0.5,
        volume.yLength / 2 - 0.5,
        volume.zLength / 2 - 0.5
    );

    console.log(geometry, material);
    console.log(volume);

    return (
        <>
            <mesh geometry={geometry} material={material} />
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
                    <NRRDTest />
                    <OrbitControls />

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default NRRDView;
