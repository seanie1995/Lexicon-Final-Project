import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export const metadata: Metadata = {
	title: "Page Not Found | The Digital Archivist",
	description: "The page you are looking for could not be found in our archive.",	
	
};

export default function NotFound() {
	return (
		<main className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-background">
			<div className="space-y-6 max-w-md">
				<div className="flex justify-center">
					<div className="p-6 bg-surface-container-low rounded-full">
						<Search className="w-12 h-12 text-primary opacity-50" />
					</div>
				</div>
				<h1 className="font-headline text-5xl text-on-surface italic tracking-tight">
					Error 404: The story you are looking for has not yet been written.
				</h1>
				<p className="font-body text-lg text-secondary leading-relaxed">
					The volume you are looking for appears to have been misplaced or
					never existed in our archive.
				</p>
				<div className="pt-8">
					<Link
						href="/"
						className="inline-flex items-center px-8 py-4 bg-primary text-on-primary font-label font-bold tracking-widest hover:bg-primary-container transition-all duration-300"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						RETURN TO CATALOG
					</Link>
				</div>
			</div>
		</main>
	);
}
