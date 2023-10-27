import React, { useEffect, useRef, memo, useMemo } from "react";
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

type ResultIconProps = {
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
            {state.includes("shield") ? (
                <HealthAndSafety sx={{ color: color, fontSize: "1rem" }} />
            ) : null}
            {state.includes("goggle") ? (
                <Visibility sx={{ color: color, fontSize: "1rem" }} />
            ) : null}
            {state.includes("neck") ? (
                <PersonAddAlt1 sx={{ color: color, fontSize: "1rem" }} />
            ) : null}
            {state.includes("apron") ? (
                <Person sx={{ color: color, fontSize: "1rem" }} />
            ) : null}
            {state.includes("glove") ? (
                <SignLanguage sx={{ color: color, fontSize: "1rem" }} />
            ) : null}
        </>
    );
}
const MemoResultIcon = memo(ResultIcon);

type ResultDataProps = {
    children: React.ReactNode;
    value: number;
    coefficient: number;
    maxHp: number;
    damageColor?: string;
    dangerColor?: string;
};
function ResultData({
    children,
    value,
    coefficient,
    maxHp,
    damageColor = "#DEAD29", // Orange
    dangerColor = "#B83100", // Red
    ...props
}: ResultDataProps) {
    const [color, length] = useMemo(() => {
        const dose = 120 * coefficient * value;
        const hp = maxHp - dose;
        const percent = hp / maxHp;

        const color = hp < 0 ? dangerColor : damageColor;
        const length = hp < 0 ? 0 : percent > 1.0 ? 100 : 100 * percent;

        return [color, length];
    }, [value, coefficient, maxHp, damageColor, dangerColor]);

    return (
        <>
            <div className={`${style.data}`}>
                {/* Bar */}
                <div className={`${style.bar}`}>
                    {/* back ground */}
                    <div className={`${style.bg}`}>
                        {/* Damage Bar */}
                        <div
                            className={`${style.damage}`}
                            style={{ backgroundColor: color }}
                        >
                            {/* HP Bar */}
                            <div
                                className={`${style.hp}`}
                                style={{ width: `${length}%` }}
                            />
                        </div>
                    </div>
                </div>
                {/* Value */}
                <div className={`${style.numerical}`}>
                    <div className={`${style.category}`}>{children}</div>
                    <div className={`${style.value}`}>
                        {Math.round(maxHp - 120 * coefficient * value)}
                        <span className={`${style.maxHp}`}>/{maxHp}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
const MemoResultData = memo(ResultData);

type DosimeterResultProps = {
    result: ResultsByName;
    equipments: Equipments;
    coefficient: number;
    yearN: number;
    onceMaxHp: number;
};
function DosimeterResult({
    result,
    equipments,
    coefficient,
    yearN,
    onceMaxHp,
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

    return (
        <>
            <div className={`${style.dose}`}>
                {/* Name */}
                <div className={`${style.name}`}>
                    <div className={`${style.identifier}`}>
                        {result.displayName ? result.displayName : result.name}
                    </div>
                    <div className={`${style.icon}`}>
                        <MemoResultIcon state={state} />
                    </div>
                </div>
                {/* Datas */}
                <div className={`${style.result}`}>
                    <div className={`${style.year}`}>
                        <MemoResultData
                            value={value}
                            coefficient={yearN * coefficient}
                            maxHp={20000}
                        >
                            Year
                        </MemoResultData>
                    </div>
                    <div className={`${style.once}`}>
                        <MemoResultData
                            value={value}
                            coefficient={coefficient}
                            maxHp={onceMaxHp}
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

type dosimeterUIProps = {
    nPerPatient?: number;
    nPerYear?: number;
    limitOnce?: number;
};
export function DosimeterUI({
    nPerPatient = 1,
    nPerYear = 500,
    limitOnce = 100,
    ...props
}: dosimeterUIProps) {
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
        Player: folder({
            "Dosimeter Config": folder(
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
                { collapsed: true }
            ),
        }),
    }));

    return (
        <>
            <div id="DosimeterUI" className={`${style.dose_list}`}>
                <div className={`${style.label}`}>
                    Dose
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
                    />
                ))}
            </div>
        </>
    );
}
