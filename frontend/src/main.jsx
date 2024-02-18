import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit";
import { scrollSepolia } from "wagmi/chains";
const chains = [scrollSepolia] 

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: 'IhPxRG5ZFQ9r7YAE5P4BDplGR0HmtJ8y', // or infuraId
    walletConnectProjectId: '3c28c455f2030d70d1c536c1e1260699',
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // 
    chains:chains,
  })
)

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
    <QueryClientProvider client={queryClient}>

      <ConnectKitProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </Router>
      </ConnectKitProvider>
    </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);