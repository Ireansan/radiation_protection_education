/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  assetPrefix: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  reactStrictMode: true,
  trailingSlash: true,
  ignoreDuringBuilds: true,
  images: {
    loader: 'akamai',
    path: '/',
  },
}

module.exports = nextConfig
