import React from "react";
import ReactDOM from "react-dom/client";

// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth
import {
    PublicClientApplication,
    EventType,
    EventMessage,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./lib/authConfig.ts";

// Query
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/api.ts";

// State
import { Provider } from "jotai";

// Pages
import Home from "./pages/Home.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import Journal from "./pages/Journal.tsx";
import Theme from "./pages/Theme.tsx";
import NotFound from "./pages/NotFound.tsx";

// CSS
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";

// Create msal instance
const msalInstance = new PublicClientApplication(msalConfig);

// Check if there is no active account, and there are multiple accounts, then set active account to first account
await msalInstance.initialize();
if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event: EventMessage) => {
    if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
            event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            event.eventType === EventType.SSO_SILENT_SUCCESS) &&
        // @ts-ignore
        event.payload.account
    ) {
        // @ts-ignore
        msalInstance.setActiveAccount(event.payload.account);
    }
});

// Create Router
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/journal",
                element: <Journal />,
            },
            {
                path: "/theme",
                element: <Theme />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider>
            <MsalProvider instance={msalInstance}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <Toaster className="font-virgil" />
                </QueryClientProvider>
            </MsalProvider>
        </Provider>
    </React.StrictMode>,
);
