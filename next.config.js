/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.GITHUB_ACTIONS ? '/radiation_protection_education' : '',
  assetPrefix: '/radiation_protection_education/',
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig
