/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname, // makes sure frontend is treated as root
};

module.exports = nextConfig;
