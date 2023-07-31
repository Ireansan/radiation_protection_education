import getConfig from "next/config";

export function applyBasePath(filepath: string): string {
    const basePath = process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education';

    return `${basePath}${filepath}`;
}
