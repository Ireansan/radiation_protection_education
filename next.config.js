/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "production" ? '/radiation_protection_education' : '',
  assetPrefix: '/radiation_protection_education/',
  trailingSlash: true,
  reactStrictMode: false,
}

module.exports = nextConfig
