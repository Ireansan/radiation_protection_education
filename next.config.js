/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.GITHUB_PAGES ? '/radiation_protection_education' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/radiation_protection_education' : '',
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig
