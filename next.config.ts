import type { NextConfig } from "next";

// 部署到 GitHub Pages 時網址會在 /ntust-life 底下；本機開發則為空字串
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
