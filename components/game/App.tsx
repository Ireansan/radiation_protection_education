/**
 *
 */

import { GameTemplate } from "./GameTemplate";

import { BasicSceneEnv, BasicScenePhysics } from "./scenes/BasicScene";

import styles from "../../styles/css/game_template.module.css";

export default function App() {
    /**
     * NOTE: Enviroment
     * @link https://sketchfab.com/3d-models/star-wars-the-clone-wars-venator-prefab-8a1e1760391c4ac6a50373c2bf5efa2e
     * @link https://sketchfab.com/3d-models/the-picture-gallery-231fdb3e9e354c6faaa3c250f8c9988f
     * @link https://sketchfab.com/3d-models/the-hallwyl-museum-1st-floor-combined-f74eefe9f1cd4a2795a689451e723ee9
     * @link https://sketchfab.com/3d-models/crane-mast-3b943b2211284d0cb0bbad32399be58c
     */
    return (
        <>
            <GameTemplate
                childrenEnv={<BasicSceneEnv />}
                childrenPhysics={<BasicScenePhysics />}
            />
        </>
    );
}
