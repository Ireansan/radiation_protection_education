import getConfig from "next/config";

export const googleFormsURL =
    process.env.NODE_ENV === "development"
        ? // ? "https://github.com/Ireansan/radiation_protection_education" // FIXME: Debug
          "https://forms.gle/rARTkRysHuaLKKdZ7" // FIXME: Debug
        : "https://forms.gle/rARTkRysHuaLKKdZ7";
