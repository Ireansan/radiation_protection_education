import React from "react";
import { SwiperSlide } from "swiper/react";

import { applyBasePath } from "../../../../utils";

import style from "../../../../styles/css/tips.module.css";

export type TipsItemProps = {
    children: React.ReactNode;
    imgSrc: string;
    imgAlt?: string;
};

export function TipsItem({
    children,
    imgSrc,
    imgAlt,
    ...props
}: TipsItemProps) {
    return (
        <>
            <SwiperSlide className={style.swiperSlide}>
                <div className={`${style.tipsItem}`}>
                    <div className={`${style.text}`}>{children}</div>
                    <img
                        src={applyBasePath(imgSrc)}
                        alt={imgAlt}
                    />
                </div>
            </SwiperSlide>
        </>
    );
}
