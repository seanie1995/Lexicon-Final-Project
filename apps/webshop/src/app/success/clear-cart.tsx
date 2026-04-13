"use client";

import { useEffect, useRef, useState } from "react";

export function ClearCartOnMount() {
	const hasCleared = useRef(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && !hasCleared.current) {
			hasCleared.current = true;
			localStorage.setItem("cart", "[]");
		}
	}, [mounted]);

	return null;
}
