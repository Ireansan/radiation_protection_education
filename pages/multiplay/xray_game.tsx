import styles from "../../styles/threejs.module.css";

import { XRayRoomGame } from "../../components/scenes";

export default function App() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <XRayRoomGame />
            </div>
        </div>
    );
}
