import { createTheme, type PaletteOptions, type Theme } from "@mui/material";

const shape = { borderRadius: 12 };

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
	components: {
		MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
	},
});

export const darkTheme = createTheme({
	shape,
	typography,
	palette: darkPalette,
	components: {
		MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
	},
});

export const chartPalette = {
	steps: "#2e9e44",
	average: "#7c6ff0",
	maximum: "#eb673b",
	walkingDays: "#0e9aa7",
};

export function getTheme(mode: "light" | "dark"): Theme {
	return mode === "dark" ? darkTheme : lightTheme;
}
