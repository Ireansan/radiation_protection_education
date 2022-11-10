/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.URL_PREFIX ? '/' + process.env.URL_PREFIX : '',
  assetPrefix: process.env.URL_PREFIX ? '/' + process.env.URL_PREFIX : '',
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig
