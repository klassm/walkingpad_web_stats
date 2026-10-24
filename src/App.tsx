import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { Main } from "./Main/Main.js";
import { ColorModeProvider, useColorMode } from "./theme/ColorModeContext.js";
import { getTheme } from "./theme/theme.js";

const queryClient = new QueryClient();

function ThemedApp() {
	const { resolvedMode } = useColorMode();
	const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Main />
		</ThemeProvider>
	);
}

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en">
			<QueryClientProvider client={queryClient}>
				<ColorModeProvider>
					<ThemedApp />
				</ColorModeProvider>
			</QueryClientProvider>
		</LocalizationProvider>
	);
}

export default App;
