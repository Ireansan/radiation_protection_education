import styles from "../../styles/threejs.module.css";

import { StentGame } from "../../components/scenes";

export default function App() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <StentGame />
            </div>
        </div>
    );
}
