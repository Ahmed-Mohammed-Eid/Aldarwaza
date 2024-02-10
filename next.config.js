/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'localhost:3000'
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com'
            }
        ]
    }
}

module.exports = nextConfig
