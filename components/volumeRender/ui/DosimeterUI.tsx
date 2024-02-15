import React, { useEffect, useRef, memo, useMemo, useState } from "react";
import { addEffect } from "@react-three/fiber";
import { useControls, folder } from "leva";
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

import type { ResultsByName } from "../../../src";

// ==========
// Store
import { useStore } from "../../store";
import type { Equipments } from "../../store";

// ==========
// Styles
import style from "../../../styles/css/dosimeter.module.css";

/**
 * References
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Speed/Boost.tsx
 * @link https://codesandbox.io/s/lo6kp?file=/src/styles.css
 * @link https://codesandbox.io/s/i2160?file=/src/Hud.js
 */

export type ResultIconProps = {
    state: string[];
    color?: string;
};
/**
 * Icons Component.
 * @param state - state of survey point.
 * @param color - color of icon. Default is `#D4875D`.
 */
function ResultIcon({
    state,
    color = "#D4875D", // Orange
    ...props
}: ResultIconProps) {
    // ==================================================
    // Element
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
    typeValue: string;
    isXR: boolean;
};
/**
 * Data Component.
 * @param children - category name.
 * @param value - exposure dose.
 * @param coefficient - coefficient of impact from protection.
 * @param maxHp - upper limit of exposure.
 * @param typeBar - display type of bar.
 * @param typeValue - display type of value.
 * @param isXR - If `true` it will be styled for XR.
 */
function ResultData({
    children,
    value,
    coefficient,
    maxHp,
    typeBar,
    typeValue,
    isXR,
    ...props
}: ResultDataProps) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    const [isDanger, length, isAddBar] = useMemo(() => {
        const isAddBar = typeBar === "addition" ? true : false;

        const dose = 120 * coefficient * value;
        const dosePercent = dose / maxHp;
        const doseLength = dosePercent > 1.0 ? 100 : 100 * dosePercent;

        const hp = maxHp - dose;
        const hpPercent = hp / maxHp;
        const hpLength = hp < 0 ? 0 : hpPercent > 1.0 ? 100 : 100 * hpPercent;

        const isDanger = hp < 0;
        const length = isAddBar ? doseLength : hpLength;

        return [isDanger, length, isAddBar];
    }, [value, coefficient, maxHp, typeBar]);

    // --------------------------------------------------
    const [isAddValue] = useMemo(() => {
        const isAddValue = typeValue === "addition" ? true : false;

        return [isAddValue];
    }, [typeValue]);

    // ==================================================
    // Element
    return (
        <>
            <div className={`${style.data} ${isXR && `${style.isXR}`}`}>
                {/* Bar */}
                <div className={`${style.bar} ${isXR && `${style.isXR}`}`}>
                    {/* back ground */}
                    <div
                        className={`${style.bg} ${
                            isAddBar && `${style.isAdd}`
                        }`}
                    >
                        {/* Damage Bar */}
                        <div
                            className={`${style.damage} 
                            ${isAddBar ? `${style.isAdd}` : `${style.isSub}`}
                            ${isDanger && `${style.danger}`}`}
                        >
                            {/* HP Bar */}
                            <div
                                className={`${style.hp} 
                                ${
                                    isAddBar
                                        ? `${style.isAdd}`
                                        : `${style.isSub}`
                                }
                                ${isAddBar && isDanger && `${style.danger}`}`}
                                style={{ width: `${length}%` }}
                            />
                        </div>
                    </div>
                </div>
                {/* Value */}
                <div
                    className={`${style.numerical} ${isXR && `${style.isXR}`}`}
                >
                    <div className={`${style.category}`}>{children}</div>
                    <div
                        className={`${style.value} ${
                            isDanger && `${style.danger}`
                        }`}
                    >
                        {isAddValue
                            ? Math.round(120 * coefficient * value)
                            : Math.round(maxHp - 120 * coefficient * value)}
                        <span
                            className={`${style.maxHp} ${
                                isXR && `${style.isXR}`
                            }`}
                        >
                            /{maxHp}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
const MemoResultData = memo(ResultData);

export type DosimeterResultProps = {
    result: ResultsByName;
    equipments: Equipments;
    typeOrder: string;
    typeBar: string;
    typeValue: string;
    isXR: boolean;
};
/**
 * Exposure Dose Component.
 * @param result - dosimeter result.
 * @param equipments - equipped state of protective equipment.
 * @param typeOrder - order of data.
 * @param typeBar - display type of bar.
 * @param typeValue - display type of value.
 * @param isXR - If `true` it will be styled for XR.
 */
function DosimeterResult({
    result,
    equipments,
    typeOrder,
    typeBar,
    typeValue,
    isXR,
    ...props
}: DosimeterResultProps) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    // useStore
    const [sceneStates] = useStore((state) => [state.sceneStates]);
    const { dosimeterSettingsState } = sceneStates;
    const { N_perPatient, N_perYear, Limit_once } = dosimeterSettingsState;

    // --------------------------------------------------
    // displayed value and state
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
                !state.includes(result.category) && state.push(result.category);
            }
        }

        return [value, state];
    }, [result, equipments]);

    // --------------------------------------------------
    // order of data
    const isYearOnceOrder = useMemo(() => {
        return typeOrder === "year-once" ? true : false;
    }, [typeOrder]);

    // ==================================================
    // Element
    return (
        <>
            <div className={`${style.dose} ${isXR && `${style.isXR}`}`}>
                {/* Name */}
                <div className={`${style.name} ${isXR && `${style.isXR}`}`}>
                    <div
                        className={`${style.identifier} ${
                            isXR && `${style.isXR}`
                        }`}
                    >
                        {result.displayName ? result.displayName : result.name}
                    </div>
                    <div className={`${style.icons}`}>
                        <MemoResultIcon state={state} />
                    </div>
                </div>
                {/* Datas */}
                <div className={`${style.result} ${isXR && `${style.isXR}`}`}>
                    <div
                        className={`${style.year} ${
                            !isYearOnceOrder && style.isOnceYearOrder
                        }`}
                    >
                        <MemoResultData
                            value={value}
                            coefficient={N_perYear * N_perPatient}
                            maxHp={20000}
                            typeBar={typeBar}
                            typeValue={typeValue}
                            isXR={isXR}
                        >
                            Year
                        </MemoResultData>
                    </div>
                    <div
                        className={`${style.once} ${
                            !isYearOnceOrder && style.isOnceYearOrder
                        }`}
                    >
                        <MemoResultData
                            value={value}
                            coefficient={N_perPatient}
                            maxHp={Limit_once}
                            typeBar={typeBar}
                            typeValue={typeValue}
                            isXR={isXR}
                        >
                            Once
                        </MemoResultData>
                    </div>
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
    typeData?: string;
    typeBar?: string;
    typeValue?: string;
    isXR?: boolean;
    activeNames?: string[];
};
/**
 * UI for a list of exposure doses.
 * @param nPerPatient - number of irradiations per patient. Default is `1`.
 * @param nPerYear - number of implementations per year. Default is `500`.
 * @param limitOnce - upper limit per patient. Default is `100`.
 * @param typeOrder - order of data. Default is `year-once`.
 * @param typeData - display type of data. Default is `addition`.
 * @param typeBar - display type of bar. Default is `addition`.
 * @param typeValue - display type of value. Default is `addition`.
 * @param isXR - If `true` it will be styled for XR. Default is `false`.
 * @param activeNames - Designation of survey points to be displayed. Default is `undefined`.
 */
export function DosimeterUI({
    nPerPatient = 1,
    nPerYear = 500,
    limitOnce = 100,
    typeOrder = "year-once",
    typeData = "addition",
    typeBar = "addition",
    typeValue = "addition",
    isXR = false,
    activeNames = undefined,
    ...props
}: DosimeterUIProps) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    // useStore
    const [set, playerState, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates.playerState,
        state.sceneStates,
    ]);
    const { equipments } = playerState;
    const { dosimeterResults } = sceneStates;

    // --------------------------------------------------
    // Results of Dose Values
    const results = React.useMemo(() => {
        if (!activeNames) {
            return dosimeterResults;
        }

        const results = dosimeterResults.filter((value) => {
            return activeNames.some((name) => {
                return value.name === name;
            });
        });

        return results;
    }, [activeNames, dosimeterResults]);

    // --------------------------------------------------
    // Control Panel
    const [dosimeterConfig, setDosimeterConfig] = useControls(() => ({
        Scene: folder({
            Options: folder({
                "Dosimeter Settings": folder(
                    {
                        Parameter: folder(
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
                            },
                            { order: -1, collapsed: true }
                        ),
                        Layout: folder(
                            {
                                type_order: {
                                    value: typeOrder,
                                    options: ["year-once", "once-year"],
                                    label: "order",
                                },
                                type_data: {
                                    value: typeData,
                                    options: ["addition", "subtraction"],
                                    label: "data",
                                    onChange: (e) => {
                                        setDosimeterConfig({
                                            type_bar: e,
                                        });
                                        setDosimeterConfig({
                                            type_value: e,
                                        });
                                    },
                                },
                                type_bar: {
                                    value: typeBar,
                                    options: ["addition", "subtraction"],
                                    label: "bar",
                                    render: () => false,
                                },
                                type_value: {
                                    value: typeValue,
                                    options: ["addition", "subtraction"],
                                    label: "value",
                                    render: () => false,
                                },
                            },
                            { order: 1, collapsed: true }
                        ),
                    },
                    { order: -1, collapsed: true }
                ),
            }),
        }),
    }));

    // ==================================================
    // Hooks (Effect)
    // --------------------------------------------------
    // set dosimeter config whent update controles panel
    React.useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                dosimeterSettingsState: {
                    N_perPatient: dosimeterConfig.N_perPatient,
                    N_perYear: dosimeterConfig.N_perYear,
                    Limit_once: dosimeterConfig.Limit_once,
                },
            },
        }));
    }, [dosimeterConfig]);

    // --------------------------------------------------
    // set dosimeter config when update arugments
    React.useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                dosimeterSettingsState: {
                    N_perPatient: nPerPatient,
                    N_perYear: nPerYear,
                    Limit_once: limitOnce,
                },
            },
        }));
        setDosimeterConfig({
            N_perPatient: nPerPatient,
            N_perYear: nPerYear,
            Limit_once: limitOnce,
        });
    }, [nPerPatient, nPerYear, limitOnce]);

    // ==================================================
    // Element
    return (
        <>
            <div
                id={!isXR ? "DosimeterUI" : "XRDosimeterUI"}
                className={`${style.dose_list} ${isXR && `${style.isXR}`}`}
            >
                <div className={`${style.label} ${isXR && `${style.isXR}`}`}>
                    Dosimeter
                    <span
                        className={`${style.unit} ${isXR && `${style.isXR}`}`}
                    >
                        [&micro;Sv]
                    </span>
                </div>
                {results.map((result, index) => (
                    <MemoDosimeterResult
                        key={index}
                        result={result}
                        equipments={equipments}
                        typeOrder={dosimeterConfig.type_order}
                        typeBar={dosimeterConfig.type_bar}
                        typeValue={dosimeterConfig.type_value}
                        isXR={isXR}
                    />
                ))}
            </div>
        </>
    );
}
