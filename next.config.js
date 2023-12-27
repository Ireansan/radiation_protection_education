const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        // If you use remark-gfm, you'll need to use next.config.mjs
        // as the package is ESM only
        // https://github.com/remarkjs/remark-gfm#install
        remarkPlugins: [],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath:
        process.env.NODE_ENV === "development"
            ? ""
            : "/radiation_protection_education",
    assetPrefix:
        process.env.NODE_ENV === "development"
            ? ""
            : "/radiation_protection_education",
    reactStrictMode: true,
    trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true
    },
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

module.exports = withMDX(nextConfig);
