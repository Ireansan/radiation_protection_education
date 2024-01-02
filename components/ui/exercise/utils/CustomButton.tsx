import React from "react";
import { useSwiper } from "swiper/react";
import Link from "next/link";

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

export type LinkButtonProps = {
    href: string;
    children: React.ReactNode;
};
export function LinkButton({ href, children }: LinkButtonProps) {
    return (
        <div className={`${style.linkButton}`}>
            <Link href={href}>{children}</Link>
        </div>
    );
}
