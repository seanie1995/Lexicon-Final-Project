export type Theme = "light" | "dark";

type Listener = () => void;

let currentTheme: Theme = (typeof window !== "undefined"
	? (localStorage.getItem("theme") as Theme | null)
	: null) ?? "light";

const listeners = new Set<Listener>();

function notify() {
	for (const listener of listeners) {
		listener();
	}
}

export function subscribe(listener: Listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getSnapshot(): Theme {
	return currentTheme;
}

export function getServerSnapshot(): Theme {
	return "light";
}

export function toggleTheme() {
	const next = currentTheme === "dark" ? "light" : "dark";
	currentTheme = next;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(next);
	localStorage.setItem("theme", next);
	document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;

	notify();
}
