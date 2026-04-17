import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["shared-types", "ui", "db"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.gutenberg.org",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default nextConfig;
