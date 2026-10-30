import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 生产构建产出 .next/standalone，部署时只带运行必需文件
  output: "standalone",
  experimental: {
    // 后台上传头像需要比默认 1MB 更宽松的表单体积上限
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
