import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/nfc-card-proyect' : '',
  trailingSlash: true,
};

export default nextConfig;
