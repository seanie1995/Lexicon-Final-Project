import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["shared-types", "ui", "db"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.gutenberg.org",
			}
		],
	},
};

export default nextConfig;
