import { Provider } from 'react-redux';
import { store } from './store';
import { RouterProvider } from 'react-router-dom';
import { router } from '@pages/RouterPages';
import SnackbarProvider from '@components/Snackbar';
import { theme } from '@static/theme';
import { ThemeProvider } from '@mui/material/styles';
import Notifier from '@containers/Notifier';
import { SigningCosmWasmProvider } from './contexts/cosmwasm';

window.walletType = 'keplr';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={99}>
          <SigningCosmWasmProvider>
            <Notifier />
            <RouterProvider router={router} />
          </SigningCosmWasmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
