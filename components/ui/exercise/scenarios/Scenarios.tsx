import React, { memo, useEffect, useMemo } from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useSwiper } from "swiper/react";

import { useStore } from "../../../store";
import type { Equipments } from "../../../store";
import type { DoseValue } from "src";

import style from "../../../../styles/css/exercise.module.css";

function calcDose(
    coefficient: number,
    value: {
        dose: DoseValue;
        category: string | undefined;
        coefficient: number | undefined;
    },
    equipments: Equipments
) {
    let guardCoefficient = 1;
    if (value.category) {
        let categoryIndex: number = Object.keys(equipments).indexOf(
            value.category
        );
        let isEquipped: boolean | undefined =
            Object.values(equipments)[categoryIndex];
        let coefficient = value.coefficient ? value.coefficient : 1;

        if (isEquipped) {
            guardCoefficient *= coefficient;
        }
    }

    return 120 * coefficient * (guardCoefficient * value.dose.data);
}

interface ScenearioConfig {
    distanceMin?: number; // [m]
    distanceMax?: number; // [m]
}
function useScenario(scenearioConfig: ScenearioConfig) {
    const [set, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates,
    ]);
    const {
        dosimeterResults,
        playerState,
        doseOrigin,
        dosimeterSettingsState,
    } = sceneStates;
    const { equipments } = playerState;

    const { distanceMin, distanceMax } = scenearioConfig;

    // Distance
    const [distance, inRange] = useMemo(() => {
        const playerPosition = playerState.position.clone().setY(0);
        const origin = doseOrigin.clone().setY(0);

        const distance = origin.distanceTo(playerPosition);
        const inRangeMin = distanceMin ? distanceMin <= distance : true;
        const inRangeMax = distanceMax ? distance <= distanceMax : true;
        return [distance, inRangeMin && inRangeMax];
    }, [playerState, doseOrigin, distanceMin, distanceMax]);

    // Dose values
    const [doseValues, dosimeterResultsLength] = useMemo(() => {
        const doseValues = dosimeterResults.map((value) => {
            const doseValue = value.dose.reduce((acculator, currentValue) =>
                acculator.data > currentValue.data ? acculator : currentValue
            );

            return {
                dose: doseValue,
                state: doseValue.state,
                category: value.category,
                coefficient: value.coefficient,
            };
        });

        return [doseValues, doseValues.length];
    }, [dosimeterResults]);

    // Dose within
    const [yearWithin, onceWithin, allWithin] = useMemo(() => {
        const { N_perYear, N_perPatient, Limit_once } = dosimeterSettingsState;

        const yearWithin: number = doseValues
            .map((value) => {
                return (
                    calcDose(N_perYear * N_perPatient, value, equipments) <
                    20000
                );
            })
            .filter((value) => value === true).length;

        const onceWithin: number = doseValues
            .map((value) => {
                return calcDose(N_perPatient, value, equipments) < Limit_once;
            })
            .filter((value) => value === true).length;

        return [
            yearWithin,
            onceWithin,
            yearWithin === dosimeterResultsLength &&
                onceWithin === dosimeterResultsLength,
        ];
    }, [
        dosimeterSettingsState,
        doseValues,
        dosimeterResultsLength,
        equipments,
    ]);

    // Shield
    const [withinShield, allWithinShield] = useMemo(() => {
        const withinShield: number = doseValues.filter(
            (value) => value.state?.includes("shield")
        ).length;

        return [withinShield, withinShield === doseValues.length];
    }, [doseValues]);

    return {
        distance: distance,
        inRange: inRange,
        dosimeterResultsLength: dosimeterResultsLength,
        yearWithin: yearWithin,
        onceWithin: onceWithin,
        allWithin: allWithin,
        withinShield: withinShield,
        allWithinShield: allWithinShield,
    };
}

/**
 *
 */
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

/**
 *
 */
export function Exercise1() {
    const [set, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates,
    ]);
    const { exerciseProgress } = sceneStates;

    const swiper = useSwiper();

    const RangeRadius = 0.6; // [m]
    const {
        distance,
        inRange,
        dosimeterResultsLength,
        yearWithin,
        onceWithin,
        allWithin,
        withinShield,
    } = useScenario({ distanceMax: RangeRadius });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise1: inRange && allWithin,
                },
            },
        }));
    }, [inRange, allWithin]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 1</h3>
                <div className={`${style.items}`}>
                    {/* distance < 0.5 */}
                    <MemoItem isDone={inRange}>
                        distance in {(distance * 100).toFixed(2)} /{" "}
                        {RangeRadius * 100} [cm]
                    </MemoItem>
                    <MemoItem isDone={allWithin}>
                        All within regulatory limits.
                        <br />
                        Year: {yearWithin} / {dosimeterResultsLength}
                        <br />
                        Once: {onceWithin} / {dosimeterResultsLength}
                    </MemoItem>
                    <MemoItem isDone={withinShield === 0}>
                        (Optional) No Shield
                        <br />
                        Shield: {withinShield} / {dosimeterResultsLength}
                    </MemoItem>
                </div>
                <button
                    className={`${style.slideNext}`}
                    disabled={!exerciseProgress.execise1}
                    onClick={() => {
                        swiper.slideNext();
                    }}
                >
                    Next &rarr;
                </button>
            </div>
        </>
    );
}
