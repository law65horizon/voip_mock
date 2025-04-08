import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from "@/components/ui/theme-provider"
// import {GlobalProvider} from '../src/context/GlobalProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* <GlobalProvider> */}
        <App />
      {/* </GlobalProvider> */}
    </ThemeProvider>
  </StrictMode>
);