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

    const swiper = useSwiper();

    const RangeRadius = 60; // [cm]

    const [distance, inRange] = useMemo(() => {
        const playerPosition = playerState.position.clone().setY(0);
        const origin = doseOrigin.clone().setY(0);

        const distance = origin.distanceTo(playerPosition) * 100;
        return [distance, distance < RangeRadius];
    }, [playerState, doseOrigin]);

    const [yearWithin, onceWithin, allWithin] = useMemo(() => {
        const resultLength = dosimeterResults.length;
        const { N_perYear, N_perPatient, Limit_once } = dosimeterSettingsState;

        const doseValues = dosimeterResults.map((value) => {
            const doseValue = value.dose.reduce((acculator, currentValue) =>
                acculator.data > currentValue.data ? acculator : currentValue
            );

            return {
                dose: doseValue,
                category: value.category,
                coefficient: value.coefficient,
            };
        });

        const yearResult = doseValues
            .map((value) => {
                return (
                    calcDose(N_perYear * N_perPatient, value, equipments) <
                    20000
                );
            })
            .filter((value) => value === true).length;

        const onceResult = doseValues
            .map((value) => {
                return calcDose(N_perPatient, value, equipments) < Limit_once;
            })
            .filter((value) => value === true).length;

        return [
            yearResult,
            onceResult,
            yearResult === resultLength && onceResult === resultLength,
        ];
    }, [dosimeterResults, dosimeterSettingsState, equipments]);

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
                        distance in {distance.toFixed(2)} / {RangeRadius} [cm]
                    </MemoItem>
                    <MemoItem isDone={allWithin}>
                        All within regulatory limits.
                        <br />
                        Year: {yearWithin} / {dosimeterResults.length}
                        <br />
                        Once: {onceWithin} / {dosimeterResults.length}
                    </MemoItem>
                </div>
                <button
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
