/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['backend.ollivu.com','localhost','192.168.4.42', '192.168.5.6','192.168.4.56', '192.168.0.107'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.ollivu.com',
        pathname: '/uploads/',
       },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/',
       },
      {
        protocol: 'http',
        hostname: '192.168.4.42',
        port: '5000',
        pathname: '/uploads/',
      },
      {
        protocol: 'http',
        hostname: '192.168.5.6',
        port: '5000', 
        pathname: '/uploads/',
      },
      {
        protocol: 'http',
        hostname: '192.168.4.56',
        port: '5000',
        pathname: '/uploads/',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.107',
        port: '5000',
        pathname: '/uploads/',
      },
    ],
  },
}

module.exports = nextConfig