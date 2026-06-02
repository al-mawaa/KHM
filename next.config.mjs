import path from "path";

const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-router-dom": path.resolve("./src/__compat__/react-router-dom.tsx"),
    };
    return config;
  },
};

export default nextConfig;
