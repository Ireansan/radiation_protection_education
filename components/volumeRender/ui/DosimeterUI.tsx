import React, { useEffect, useRef, memo, useMemo, useState } from "react";
import { addEffect } from "@react-three/fiber";
import { useControls, folder, button } from "leva";
import {
    Shield,
    HealthAndSafety,
    SignLanguage,
    HowToReg,
    Person,
    PersonAdd,
    PersonAddAlt1,
    Transcribe,
    Visibility,
    VisibilityOff,
    Sick,
    // BackHand
} from "@mui/icons-material";

import { useStore } from "../../store";
import type { Equipments } from "../../store";
import type { ResultsByName } from "../../../src";

import style from "../../../styles/css/dosimeter.module.css";

/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Speed/Boost.tsx
 * @link https://codesandbox.io/s/lo6kp?file=/src/styles.css
 * @link https://codesandbox.io/s/i2160?file=/src/Hud.js
 */

export type ResultIconProps = {
    state: string[];
    color?: string;
};
function ResultIcon({
    state,
    color = "#D4875D", // Orange
    ...props
}: ResultIconProps) {
    return (
        <>
            <div
                className={`${style.icon}
                    ${state.includes("shield") && `${style.active}`}`}
            >
                <HealthAndSafety sx={{ color: color, fontSize: "1rem" }} />
            </div>
            <div
                className={`${style.icon}
                    ${state.includes("goggle") && `${style.active}`}`}
            >
                <Visibility sx={{ color: color, fontSize: "1rem" }} />
            </div>
            <div
                className={`${style.icon}
                    ${state.includes("neck") && `${style.active}`}`}
            >
                <PersonAddAlt1 sx={{ color: color, fontSize: "1rem" }} />
            </div>
            <div
                className={`${style.icon}
                    ${state.includes("apron") && `${style.active}`}`}
            >
                <Person sx={{ color: color, fontSize: "1rem" }} />
            </div>
            <div
                className={`${style.icon}
                    ${state.includes("glove") && `${style.active}`}`}
            >
                <SignLanguage sx={{ color: color, fontSize: "1rem" }} />
            </div>
        </>
    );
}
const MemoResultIcon = memo(ResultIcon);

export type ResultDataProps = {
    children: React.ReactNode;
    value: number;
    coefficient: number;
    maxHp: number;
    typeBar: string;
};
function ResultData({
    children,
    value,
    coefficient,
    maxHp,
    typeBar,
    ...props
}: ResultDataProps) {
    const [isDanger, length, isHP] = useMemo(() => {
        const isHP = typeBar === "HP/MP" ? true : false;

        const dose = 120 * coefficient * value;
        const dosePercent = dose / maxHp;
        const doseLength = dosePercent > 1.0 ? 100 : 100 * dosePercent;

        const hp = maxHp - dose;
        const hpPercent = hp / maxHp;
        const hpLength = hp < 0 ? 0 : hpPercent > 1.0 ? 100 : 100 * hpPercent;

        const isDanger = hp < 0;
        const length = isHP ? hpLength : doseLength;

        return [isDanger, length, isHP];
    }, [value, coefficient, maxHp, typeBar]);

    return (
        <>
            <div className={`${style.data}`}>
                {/* Bar */}
                <div className={`${style.bar}`}>
                    {/* back ground */}
                    <div className={`${style.bg}`}>
                        {isHP ? (
                            <>
                                {/* Damage Bar */}
                                <div
                                    className={`${style.damage} ${
                                        isDanger && `${style.danger}`
                                    }`}
                                >
                                    {/* HP Bar */}
                                    <div
                                        className={`${style.hp}`}
                                        style={{ width: `${length}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* HP Bar */}
                                <div className={`${style.hp}`}>
                                    {/* Damage Bar */}
                                    <div
                                        className={`${style.damage} ${
                                            isDanger && `${style.danger}`
                                        }`}
                                        style={{ width: `${length}%` }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Value */}
                <div className={`${style.numerical}`}>
                    <div className={`${style.category}`}>{children}</div>
                    {isHP ? (
                        <>
                            <div className={`${style.value}`}>
                                {Math.round(maxHp - 120 * coefficient * value)}
                                <span className={`${style.maxHp}`}>
                                    /{maxHp}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`${style.value}`}>
                                {Math.round(120 * coefficient * value)}
                                {/* <span className={`${style.maxHp}`}>
                                    /{maxHp}
                                </span> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
const MemoResultData = memo(ResultData);

export type DosimeterResultProps = {
    result: ResultsByName;
    equipments: Equipments;
    coefficient: number;
    yearN: number;
    onceMaxHp: number;
    typeOrder: string;
    typeBar: string;
};
function DosimeterResult({
    result,
    equipments,
    coefficient,
    yearN,
    onceMaxHp,
    typeOrder,
    typeBar,
    ...props
}: DosimeterResultProps) {
    const [value, state] = useMemo(() => {
        // calc vale, state
        let doseValue =
            result.dose.length > 0
                ? result.dose.reduce((acculator, currentValue) =>
                      acculator.data > currentValue.data
                          ? acculator
                          : currentValue
                  )
                : { data: NaN, state: undefined };
        let value = !Number.isNaN(doseValue.data) ? doseValue.data : 0;
        let state = doseValue.state ? doseValue.state : [];

        // check equipment
        if (result.category) {
            let categoryIndex: number = Object.keys(equipments).indexOf(
                result.category
            );
            let isEquipped: boolean | undefined =
                Object.values(equipments)[categoryIndex];
            let coefficient = result.coefficient ? result.coefficient : 1;

            if (isEquipped) {
                value *= coefficient;
                state.push(result.category);
            }
        }

        return [value, state];
    }, [result, equipments]);

    const isYearOnceOrder = useMemo(() => {
        return typeOrder === "year-once" ? true : false;
    }, [typeOrder]);

    return (
        <>
            <div className={`${style.dose}`}>
                {/* Name */}
                <div className={`${style.name}`}>
                    <div className={`${style.identifier}`}>
                        {result.displayName ? result.displayName : result.name}
                    </div>
                    <div className={`${style.icons}`}>
                        <MemoResultIcon state={state} />
                    </div>
                </div>
                {/* Datas */}
                <div className={`${style.result}`}>
                    {isYearOnceOrder ? (
                        <>
                            <div className={`${style.year}`}>
                                <MemoResultData
                                    value={value}
                                    coefficient={yearN * coefficient}
                                    maxHp={20000}
                                    typeBar={typeBar}
                                >
                                    Year
                                </MemoResultData>
                            </div>
                            <div className={`${style.once}`}>
                                <MemoResultData
                                    value={value}
                                    coefficient={coefficient}
                                    maxHp={onceMaxHp}
                                    typeBar={typeBar}
                                >
                                    Once
                                </MemoResultData>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`${style.once}`}>
                                <MemoResultData
                                    value={value}
                                    coefficient={coefficient}
                                    maxHp={onceMaxHp}
                                    typeBar={typeBar}
                                >
                                    Once
                                </MemoResultData>
                            </div>
                            <div className={`${style.year}`}>
                                <MemoResultData
                                    value={value}
                                    coefficient={yearN * coefficient}
                                    maxHp={20000}
                                    typeBar={typeBar}
                                >
                                    Year
                                </MemoResultData>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
const MemoDosimeterResult = memo(DosimeterResult);

export type DosimeterUIProps = {
    nPerPatient?: number;
    nPerYear?: number;
    limitOnce?: number;
    typeOrder?: string;
    typeBar?: string;
};
export function DosimeterUI({
    nPerPatient = 1,
    nPerYear = 500,
    limitOnce = 100,
    typeOrder = "year-once",
    typeBar = "HP/MP",
    ...props
}: DosimeterUIProps) {
    const [set, playerProperties, sceneProperties] = useStore((state) => [
        state.set,
        state.playerProperties,
        state.sceneProperties,
    ]);
    const { equipments } = playerProperties;
    const { dosimeterResults } = sceneProperties;

    /**
     * leva panels
     */
    // Volume
    const [dosimeterConfig, setVolume] = useControls(() => ({
        Scene: folder({
            Options: folder({
                "Dosimeter Settings": folder(
                    {
                        N_perPatient: {
                            value: nPerPatient,
                            min: 1,
                            step: 1,
                            label: "N (/patient)",
                        },
                        N_perYear: {
                            value: nPerYear,
                            min: 1,
                            step: 1,
                            label: "N (/year)",
                        },
                        Limit_once: {
                            value: limitOnce,
                            min: 1,
                            label: "Limit (/once)",
                        },
                        Layout: folder(
                            {
                                type_order: {
                                    value: typeOrder,
                                    options: ["year-once", "once-year"],
                                    label: "order",
                                },
                                type_bar: {
                                    value: typeBar,
                                    options: ["HP/MP", "gauge"],
                                    label: "bar",
                                },
                            },
                            { collapsed: true }
                        ),
                    },
                    { collapsed: true }
                ),
            }),
        }),
    }));

    return (
        <>
            <div
                id="DosimeterUI"
                className={`${style.dose_list}`}
            >
                <div className={`${style.label}`}>
                    Dosimeter
                    <span className={`${style.unit}`}>[&micro;Sv]</span>
                </div>
                {dosimeterResults.map((result, index) => (
                    <MemoDosimeterResult
                        key={index}
                        result={result}
                        equipments={equipments}
                        coefficient={dosimeterConfig.N_perPatient}
                        yearN={dosimeterConfig.N_perYear}
                        onceMaxHp={dosimeterConfig.Limit_once}
                        typeOrder={dosimeterConfig.type_order}
                        typeBar={dosimeterConfig.type_bar}
                    />
                ))}
            </div>
        </>
    );
}
