import React from "react";
import { useSwiper } from "swiper/react";

import style from "../../../../styles/css/exercise.module.css";

export type NextButtonProps = { disabled: boolean };
export function NextButton({ disabled }: NextButtonProps) {
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
