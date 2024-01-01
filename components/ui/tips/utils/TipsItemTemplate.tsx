import React from "react";
import Image from "next/image";
import { SwiperSlide } from "swiper/react";

import { applyBasePath } from "../../../../utils";

import style from "../../../../styles/css/tips.module.css";

export type TipsBaseProps = {
    isEnglish?: boolean;
};

export type TipsItemProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    imgSrc?: string;
    imgAlt?: string;
};
export function TipsItem({
    title,
    children,
    imgSrc,
    imgAlt,
    ...props
}: TipsItemProps) {
    return (
        <>
            <div className={`${style.tipsItem}`}>
                <div className={`${style.title}`}>{title}</div>
                <div className={`${style.content}`}>
                    <div className={`${style.text}`}>{children}</div>
                    {imgSrc && (
                        <Image
                            className={`${style.image}`}
                            src={applyBasePath(imgSrc)}
                            alt={imgAlt ? imgAlt : ""}
                            fill={true}
                            priority={true}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
