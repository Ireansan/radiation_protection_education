import getConfig from "next/config";

export const googleFormsURL =
    process.env.NODE_ENV === "development"
        ? "https://github.com/Ireansan/radiation_protection_education" // FIXME: Debug
        : "https://docs.google.com/forms/d/e/1FAIpQLScTz27uww9rpT1gusWK54hR1XBQiCeXpZ8QvELXWl-aauBFCw/viewform?usp=sf_link"; // FIXME: Debug
