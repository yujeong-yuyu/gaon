/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'kjwon2025.github.io', pathname: '/**' },
        ],
        unoptimized: false,
        formats: ['image/avif', 'image/webp'],
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
