"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/contexts/cart-context";

export function ClearCartOnMount() {
	const { clearCart } = useCart();
	const hasCleared = useRef(false);

	useEffect(() => {
		if (!hasCleared.current) {
			hasCleared.current = true;
			clearCart();
		}
	}, [clearCart]);

	return null;
}
