import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["shared-types", "ui", "db"],
};

export default nextConfig;
