import {
	createContext,
	type FC,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type ColorModePreference = "light" | "dark" | "system";
export type ResolvedMode = "light" | "dark";

const storageKey = "walkingpad.color-mode";

function readStoredPreference(): ColorModePreference {
	try {
		const stored = localStorage.getItem(storageKey);
		if (stored === "light" || stored === "dark" || stored === "system") {
			return stored;
		}
	} catch {
		// localStorage unavailable (e.g. privacy mode) -> fall back to system
	}
	return "system";
}

function getSystemMode(): ResolvedMode {
	if (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		return "dark";
	}
	return "light";
}

interface ColorModeContextValue {
	preference: ColorModePreference;
	resolvedMode: ResolvedMode;
	setPreference: (preference: ColorModePreference) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
	undefined,
);

export const ColorModeProvider: FC<PropsWithChildren> = ({ children }) => {
	const [preference, setPreferenceState] =
		useState<ColorModePreference>(readStoredPreference);
	const [systemMode, setSystemMode] = useState<ResolvedMode>(getSystemMode);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = (event: MediaQueryListEvent) => {
			setSystemMode(event.matches ? "dark" : "light");
		};
		mediaQuery.addEventListener("change", listener);
		return () => mediaQuery.removeEventListener("change", listener);
	}, []);

	const setPreference = useCallback((nextPreference: ColorModePreference) => {
		setPreferenceState(nextPreference);
		try {
			localStorage.setItem(storageKey, nextPreference);
		} catch {
			// ignore persistence failures
		}
	}, []);

	const resolvedMode: ResolvedMode =
		preference === "system" ? systemMode : preference;

	useEffect(() => {
		document.documentElement.style.colorScheme = resolvedMode;
	}, [resolvedMode]);

	const contextValue = useMemo(
		() => ({ preference, resolvedMode, setPreference }),
		[preference, resolvedMode, setPreference],
	);

	return (
		<ColorModeContext.Provider value={contextValue}>
			{children}
		</ColorModeContext.Provider>
	);
};

export function useColorMode(): ColorModeContextValue {
	const context = useContext(ColorModeContext);
	if (!context) {
		throw new Error("useColorMode must be used within a ColorModeProvider");
	}
	return context;
}
