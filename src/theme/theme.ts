import {
	createTheme,
	type PaletteOptions,
	type Theme,
	useTheme,
} from "@mui/material";

/** Border radius scale (px) used across cards, chips and charts. */
export const radius = { sm: 4, md: 8, lg: 12, xl: 16 } as const;

/**
 * Motion tokens following Material 3 / MUI durations.
 * Animate `opacity` and `transform` only, never layout properties.
 */
export const motion = {
	short: 150,
	mediumShort: 200,
	medium: 300,
	standardEasing: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

/**
 * MUI sx treats numeric borderRadius as a MULTIPLIER of shape.borderRadius.
 * With base 4 (MUI default), sx numbers read 1:1 in px: 2→8, 2.5→10, 3→12, 4→16.
 */
const shape = { borderRadius: 4 };

const typography = {
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	h1: { fontWeight: 700 },
	h2: { fontWeight: 700 },
	h6: { fontWeight: 600 },
};

const lightPalette: PaletteOptions = {
	mode: "light",
	primary: { main: "#2e9e44" },
	secondary: { main: "#7c6ff0" },
	background: { default: "#f6f8f7", paper: "#ffffff" },
};

const darkPalette: PaletteOptions = {
	mode: "dark",
	primary: { main: "#5cc974" },
	secondary: { main: "#a99df7" },
	background: { default: "#121413", paper: "#1c1f1e" },
};

export const lightTheme = createTheme({
	shape,
	typography,
	palette: lightPalette,
	motion: { reducedMotion: "system" },
	components: {
		MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
	},
});

export const darkTheme = createTheme({
	shape,
	typography,
	palette: darkPalette,
	motion: { reducedMotion: "system" },
	components: {
		MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
	},
});

/**
 * Chart series palette derived from the color-deficiency-safe Okabe-Ito
 * scheme, with dedicated dark-mode variants. Keys: steps (green),
 * average (magenta), maximum (orange), walkingDays (sky blue).
 */
export const chartPalettes: Record<"light" | "dark", Record<string, string>> = {
	light: {
		steps: "#009E73",
		average: "#CC79A7",
		maximum: "#E69F00",
		walkingDays: "#56B4E9",
	},
	dark: {
		steps: "#4EC58F",
		average: "#E0A3C2",
		maximum: "#F0B429",
		walkingDays: "#8FC7EE",
	},
};

export function getChartPalette(mode: "light" | "dark") {
	return chartPalettes[mode];
}

/** Mode-aware chart palette as a hook. */
export function useChartPalette() {
	return getChartPalette(useTheme().palette.mode);
}

/**
 * Subtle hover highlight for stat cards: the border picks up a hint of the
 * accent, while a soft inner glow blooms out from the card edges — the card
 * itself never moves, and the glow's spread makes the hover feel animated.
 */
export function hoverableCard(theme: Theme) {
	return {
		transition: theme.transitions.create(
			["border-color", "background-color", "box-shadow"],
			{
				duration: theme.transitions.duration.short,
				easing: theme.transitions.easing.easeInOut,
			},
		),
		"&:hover": {
			borderColor: `color-mix(in srgb, ${theme.palette.primary.main} 18%, transparent)`,
			backgroundColor: `color-mix(in srgb, ${theme.palette.primary.main} 2.5%, transparent)`,
			boxShadow: `inset 0 0 28px -6px color-mix(in srgb, ${theme.palette.primary.main} 14%, transparent)`,
		},
	};
}

export function getTheme(mode: "light" | "dark"): Theme {
	return mode === "dark" ? darkTheme : lightTheme;
}
