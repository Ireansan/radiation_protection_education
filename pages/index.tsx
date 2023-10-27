import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/css/home.module.css";

import { applyBasePath } from "../utils";
const logoURL = applyBasePath("/vercel.svg");

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Radiation Protection Education</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Radiation Protection Education</h1>

                <p className={styles.description}></p>
                {/* <p>process.env.NODE_ENV {process.env.NODE_ENV}</p> */}

                <h2>Content</h2>
                <h3>Visualization</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Link href={"/visualization/extra/X-Ray"}>
                            <h2>X-Ray &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/visualization/extra/C-Arm"}>
                            <h2>C-Arm &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </Link>
                    </div>
                </div>

                <h3>Visualization (Basic)</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Link href={"/visualization/basic/X-Ray"}>
                            <h2>X-Ray &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/visualization/basic/C-Arm"}>
                            <h2>C-Arm &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </Link>
                    </div>
                </div>

                <h3>Visualization (VR)</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Link href={"/visualization/VR/X-Ray"}>
                            <h2>X-Ray &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </Link>
                    </div>
                </div>

                <h3>Game</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Link href={"/game/room1"}>
                            <h2>Room 1 &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/game/room2"}>
                            <h2>Room 2 &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/game/SampleScene"}>
                            <h2>Sample Scene &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/game/Stent_Game"}>
                            <h2>Stent + Game &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <Link href={"/game/XRay_room_Game"}>
                            <h2>XRay + Game &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>
                </div>

                <h3>Prototype</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Link href={"/prototype/c-arm_scene_rough"}>
                            <h2>C-Arm Scene &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>
                    <div className={styles.card}>
                        <Link href={"/prototype/C-Arm"}>
                            <h2>C-Arm &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>
                    <div className={styles.card}>
                        <Link href={"/prototype/YBot_IK_Prototype"}>
                            <h2>Y-Bot IK &rarr;</h2>
                            <p>Next.js + react-three/fiber</p>
                        </Link>
                    </div>
                    <div className={styles.card}>
                        <Link href={"/prototype/basic/X-Ray"}>
                            <h2>X-ray (Basic)&rarr;</h2>
                            <p>Perspective Camera</p>
                        </Link>
                    </div>
                    <div className={styles.card}>
                        <Link href={"/prototype/extra/X-Ray"}>
                            <h2>X-ray (Extra)&rarr;</h2>
                            <p>Dosimeter UI, HP Bar (CSS only)</p>
                        </Link>
                    </div>
                </div>

                <h2>References</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <a href="https://threejs.org/examples/?q=texture3d#webgl2_materials_texture3d">
                            <h2>Textrue3D example &rarr;</h2>
                            <p>Three.js examples</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://threejs.org/examples/?q=nrrd#webgl_loader_nrrd">
                            <h2>NRRDLoader example &rarr;</h2>
                            <p>Three.js examples</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://github.com/cornerstonejs/cornerstoneTools/issues/335#issuecomment-376008409">
                            <h2>NRRD Production example &rarr;</h2>
                            <p>Three.js + NRRD Production</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://contsrv.icer.kyushu-u.ac.jp/Medu/XraySim/">
                            <h2>Radiation visualization 1 &rarr;</h2>
                            <p>A-Frame</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://contsrv.icer.kyushu-u.ac.jp/Medu/XraySim2/">
                            <h2>Radiation visualization 2 &rarr;</h2>
                            <p>A-Frame</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://nextjs.org">
                            <h2>Next.js &rarr;</h2>
                            <p>React Framework</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction">
                            <h2>React Three Fiber &rarr;</h2>
                            <p>React renderer for Three.js</p>
                        </a>
                    </div>

                    <div className={styles.card}>
                        <a href="https://threejs.org/">
                            <h2>Three.js &rarr;</h2>
                            <p>JavaScript library, WebGL</p>
                        </a>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://github.com/Ireansan"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by Ireansan
                </a>
            </footer>
        </div>
    );
};

export default Home;
