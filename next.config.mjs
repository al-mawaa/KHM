import path from "path";

const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-router-dom": path.resolve("./src/__compat__/react-router-dom.tsx"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
