/** @type {import('next').NextConfig} */
const repo = 'DyDxdYdX';
const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig 