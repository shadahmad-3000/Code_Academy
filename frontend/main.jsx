import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { AuthProvider } from '@/context/authContext.jsx';
import { ChatProvider } from '@/context/chatContext.jsx';
import { ErrorBoundary } from '@/views/ErrorBoundary.jsx';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/index.css";
import "@/assets/styles/styles.css";

import { ToasterProvider } from '@/components/ui/showToast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <ToasterProvider />
          <App />
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);