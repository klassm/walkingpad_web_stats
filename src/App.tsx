import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Main } from "./Main/Main";

const queryClient = new QueryClient();

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="de">
			<QueryClientProvider client={queryClient}>
				<Main />
			</QueryClientProvider>
		</LocalizationProvider>
	);
}

export default App;
