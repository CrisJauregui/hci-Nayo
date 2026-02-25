import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { AlarmProvider } from './context/AlarmContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AlarmProvider>
          <App />
        </AlarmProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
