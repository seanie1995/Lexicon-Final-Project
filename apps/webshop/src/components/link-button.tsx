import Link from "next/link";

type LinkButtonVariant = "primary" | "secondary";

interface LinkButtonProps {
	href: string;
	children: React.ReactNode;
	variant?: LinkButtonVariant;
	className?: string;
	ariaLabel?: string;
}

const variantStyles: Record<LinkButtonVariant, string> = {
	primary:
		"bg-primary text-on-primary hover:bg-primary-container",
	secondary:
		"bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant",
};

const LinkButton = ({
	href,
	children,
	variant = "primary",
	className = "",
	ariaLabel,
}: LinkButtonProps) => {
	return (
		<Link
			href={href}
			aria-label={ariaLabel}
			className={`inline-block w-fit px-10 py-5 font-label text-xs uppercase tracking-widest transition-colors ${variantStyles[variant]} ${className}`}
		>
			{children}
		</Link>
	);
};

export default LinkButton;
