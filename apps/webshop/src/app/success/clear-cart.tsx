"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/contexts/cart-context";

export function ClearCartOnMount() {
	const { clearCart } = useCart();

	useEffect(() => {
		clearCart();
	}, [clearCart]);

	return null;
}
