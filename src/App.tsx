import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Main } from './Main/Main';

const queryClient = new QueryClient()

function App() {
  return (
    <LocalizationProvider dateAdapter={ DateAdapter }>
      <QueryClientProvider client={ queryClient }>
        <Main/>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
