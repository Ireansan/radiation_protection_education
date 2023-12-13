import { memo, useMemo } from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

import { useStore } from "../../../store";

import style from "../../../../styles/css/exercise.module.css";

function calcDose(coefficient: number, value: number) {
    return 120 * coefficient * value;
}

export type ItemProps = {
    children: React.ReactNode;
    isDone: boolean;
    color?: string;
};
export function Item({ children, isDone, color = "#65BF74" }: ItemProps) {
    return (
        <>
            <div className={`${style.item}`}>
                <div className={`${style.check}`}>
                    {isDone ? (
                        <CheckBox sx={{ color: color, fontSize: "0.8rem" }} />
                    ) : (
                        <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                    )}
                </div>
                <div
                    className={`${style.objective} ${
                        isDone && `${style.done}`
                    }`}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
const MemoItem = memo(Item);

export function Exercise1() {
    const [sceneStates] = useStore((state) => [state.sceneStates]);
    const {
        dosimeterResults,
        playerState,
        doseOrigin,
        dosimeterSettingsState,
    } = sceneStates;

    const areaLenght = 0.5; // [m]

    const distance = useMemo(() => {
        const playerPosition = playerState.position.clone().setY(0);
        const origin = doseOrigin.clone().setY(0);

        const distance = origin.distanceTo(playerPosition);
        return distance;
    }, [playerState, doseOrigin]);

    const allUnder = useMemo(() => {
        const yearResult = dosimeterResults.map((value) => {
            const doseValue = value.dose.reduce((acculator, currentValue) =>
                acculator.data > currentValue.data ? acculator : currentValue
            );
            return calcDose(
                dosimeterSettingsState.N_perYear *
                    dosimeterSettingsState.N_perPatient,
                doseValue.data
            );
        });

        const onceResult = dosimeterResults.map((value) => {
            const doseValue = value.dose.reduce((acculator, currentValue) =>
                acculator.data > currentValue.data ? acculator : currentValue
            );
            return calcDose(
                dosimeterSettingsState.N_perPatient,
                doseValue.data
            );
        });
    }, [dosimeterResults, dosimeterSettingsState]);

    return (
        <>
            <div className={`${style.content}`}>
                <h2>Exercise - 1</h2>
                <div className={`${style.items}`}>
                    {/* distance < 0.5 */}
                    <MemoItem isDone={distance < areaLenght}>
                        distance in {(distance * 100).toFixed(2)} /{" "}
                        {areaLenght * 100} [cm]
                    </MemoItem>
                    <MemoItem isDone={distance < areaLenght}>
                        distance in {(distance * 100).toFixed(2)} /{" "}
                        {areaLenght * 100} [cm]
                    </MemoItem>
                </div>
            </div>
        </>
    );
}
