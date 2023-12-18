import React, { memo, useEffect, useMemo } from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useSwiper } from "swiper/react";

import { useStore } from "../../../store";
import { useScenario } from "./useScenarios";

import style from "../../../../styles/css/exercise.module.css";

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

type NextButtonProps = { disabled: boolean };
function NextButton({ disabled }: NextButtonProps) {
    const swiper = useSwiper();

    return (
        <>
            <button
                className={`${style.slideNext}`}
                disabled={disabled}
                onClick={() => {
                    swiper.slideNext();
                }}
            >
                Next &rarr;
            </button>
        </>
    );
}

/**
 *
 */
export function Exercise1() {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const RangeRadius = 0.7; // [m]
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
                    <MemoItem isDone={inRange}>
                        Move Player to within {RangeRadius * 100} cm.
                        <br />
                        Distance: {(distance * 100).toFixed()} /{" "}
                        {RangeRadius * 100} [cm]
                    </MemoItem>
                    <MemoItem isDone={allWithin}>
                        All measurements are below the upper limit.
                        {/* All measurements below regulatory limits */}
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
                <NextButton disabled={!exerciseProgress.execise1} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise2Preparation() {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const { dosimeterResultsLength, withinShield, equipped } = useScenario({
        distanceMin: undefined,
    });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise2Preparation: withinShield === 0 && equipped === 0,
                },
            },
        }));
    }, [withinShield, equipped]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 2 (Preparation)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={withinShield === 0}>
                        All measurements to be unaffected by Shield.
                        <br />
                        (Players should not be moved.)
                        <br />
                        Shield: {withinShield} / {dosimeterResultsLength}
                    </MemoItem>
                    <MemoItem isDone={equipped === 0}>
                        Remove all Equipment.
                        <br />
                        Equipment: {equipped} / {dosimeterResultsLength}
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise2Preparation} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise2() {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const RangeRadius = 1.7; // [m]
    const { distance, inRange } = useScenario({
        distanceMin: RangeRadius,
    });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise2: inRange,
                },
            },
        }));
    }, [inRange]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 2</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={inRange}>
                        Move Player away to {RangeRadius} m.
                        <br />
                        Distance: {distance.toFixed(2)} / {RangeRadius} [m]
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise2} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise3() {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const { dosimeterResultsLength, withinShield, allWithinShield } =
        useScenario({
            distanceMin: undefined,
        });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise3: allWithinShield,
                },
            },
        }));
    }, [allWithinShield]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 3</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={allWithinShield}>
                        All measuring points are under the influence of Shield.
                        <br />
                        Shield: {withinShield} / {dosimeterResultsLength}
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise3} />
            </div>
        </>
    );
}
