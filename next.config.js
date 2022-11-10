/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  assetPrefix: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig
