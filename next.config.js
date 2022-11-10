/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "production" ? '/radiation_protection_education' : '',
  assetPrefix: '/radiation_protection_education/',
  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glb|gltf|nrrd|svg)$/,
      use: {
        loader: 'file-loader',
      }
    })
    return config
  },
}

module.exports = nextConfig
