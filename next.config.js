/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      "chiptos-collector.s3.amazonaws.com",
      "placekitten.com",
      'lh3.googleusercontent.com',
      'openseauserdata.com'
    ]
  }
}

module.exports = nextConfig
