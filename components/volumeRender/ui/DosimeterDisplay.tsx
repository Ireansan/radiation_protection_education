import React, { useEffect, useRef, memo } from "react";
import { addEffect } from "@react-three/fiber";
import { useControls, folder, button } from "leva";
import { Shield, HealthAndSafety } from "@mui/icons-material";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

import style from "../../../styles/css/dosimeter.module.css";

/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Speed/Boost.tsx
 * @link https://codesandbox.io/s/lo6kp?file=/src/styles.css
 */
const strokeDasharray = 200;

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
                <HealthAndSafety sx={{ color: color, fontSize: "14px" }} />
            ) : null}
        </>
    );
}
const MemoResultIcon = memo(ResultIcon);

type ResultDataProps = {
    category: string;
    value: number;
    coefficient: number;
    maxHp: number;
    hpColor?: string;
    damageColor?: string;
    cautionColor?: string;
    bgColor?: string;
};
function ResultData({
    category,
    value,
    coefficient,
    maxHp,
    hpColor = "#56B35D", // Green
    damageColor = "#DEAD29", // Orange
    cautionColor = "#B83100", // Red
    bgColor = "#132237",
    ...props
}: ResultDataProps) {
    const damageRef = useRef<SVGPathElement>(null);
    const hpRef = useRef<SVGPathElement>(null);

    const getColor = () => {
        let hp = maxHp - 120 * coefficient * value;

        return hp < 0 ? cautionColor : damageColor;
    };
    const getLength = () => {
        let offset = (120 * coefficient * value) / maxHp;

        return `${offset > 1.0 ? strokeDasharray : strokeDasharray * offset}`;
    };

    let stroke = getColor();
    let strokeDashoffset = getLength();

    useEffect(() =>
        addEffect(() => {
            if (!damageRef.current) return;

            stroke = getColor();
            if (damageRef.current.style.stroke !== stroke) {
                damageRef.current.style.stroke = stroke;
            }

            if (!hpRef.current) return;

            strokeDashoffset = getLength();
            if (hpRef.current.style.strokeDashoffset !== strokeDashoffset) {
                hpRef.current.style.strokeDashoffset = strokeDashoffset;
            }
        })
    );

    return (
        <>
            <div className={`${style.data}`}>
                {/* Bar */}
                <div className={`${style.bar}`}>
                    <svg
                        className={`${style.svg}`}
                        viewBox={`0 0 200 15`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* back ground */}
                        <path
                            className={`${style.bg}`}
                            d="M0,4 L200,4"
                            stroke={bgColor}
                            strokeDasharray={206}
                        />
                        {/* Damage Bar */}
                        <path
                            className={`${style.damage}`}
                            d="M2,4 L198,4"
                            ref={damageRef}
                            strokeDasharray={200}
                            style={{ stroke }}
                        />
                        {/* HP Bar */}
                        <path
                            className={`${style.hp}`}
                            d="M2,4 L198,4"
                            ref={hpRef}
                            stroke={hpColor}
                            strokeDasharray={200}
                            style={{
                                strokeDashoffset,
                            }}
                        />
                    </svg>
                </div>
                {/* Value */}
                <div className={`${style.numerical}`}>
                    <div className={`${style.category}`}>{category}</div>
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
    coefficient: number;
    onceMaxHp: number;
};
function DosimeterResult({
    result,
    coefficient,
    onceMaxHp,
    ...props
}: DosimeterResultProps) {
    let doseValue =
        result.dose.length > 0
            ? result.dose.reduce((acculator, currentValue) =>
                  acculator.data > currentValue.data ? acculator : currentValue
              )
            : { data: NaN, state: undefined };
    let value = !Number.isNaN(doseValue.data) ? doseValue.data : 0;
    let state = doseValue.state ? doseValue.state : [];

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
                            category={"Year"}
                            value={value}
                            coefficient={coefficient}
                            maxHp={20000}
                        />
                    </div>
                    <div className={`${style.once}`}>
                        <MemoResultData
                            category={"Once"}
                            value={value}
                            coefficient={1}
                            maxHp={onceMaxHp}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
const MemoDosimeterResult = memo(DosimeterResult);

export function DosimeterDisplayUI({ ...props }) {
    const [sceneProperties] = useStore((state) => [state.sceneProperties]);
    const { dosimeterResults } = sceneProperties;

    /**
     * leva panels
     */
    // Volume
    const [dosimeterConfig, setVolume] = useControls(() => ({
        "Dosimeter Config": folder({
            year: {
                value: 500,
            },
            once: {
                value: 100,
                min: 1,
            },
        }),
    }));

    return (
        <>
            <div
                id={"DosimeterDisplayUI"}
                style={{
                    position: "absolute",
                    bottom: "5px",
                    left: "5px",
                    // width: "200px",
                }}
            >
                {dosimeterResults.map((result, index) => (
                    <MemoDosimeterResult
                        key={index}
                        result={result}
                        coefficient={dosimeterConfig.year}
                        onceMaxHp={dosimeterConfig.once}
                    />
                ))}
            </div>
        </>
    );
}
