// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {

// };

// export default nextConfig;

module.exports = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental:{
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
       
      },
      
    ],
  },
};
