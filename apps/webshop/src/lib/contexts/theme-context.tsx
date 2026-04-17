"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { Theme } from "@/lib/theme-store";
import { subscribe, getSnapshot, getServerSnapshot, toggleTheme as storeToggleTheme } from "@/lib/theme-store";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme: storeToggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
