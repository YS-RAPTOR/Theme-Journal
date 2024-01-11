import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    PublicClientApplication,
    EventType,
    EventMessage,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { QueryClientProvider } from "react-query";
import { Provider } from "jotai";
import { msalConfig } from "./utils/authConfig.ts";
import { queryClient } from "./utils/api.ts";

import AuthLayout from "./layout/AuthLayout.tsx";
import Home from "./pages/Home.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import Journal from "./pages/Journal.tsx";
import Theme from "./pages/Theme.tsx";

import "./index.css";
import NotFound from "./pages/NotFound.tsx";

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
                    <AuthLayout>
                        <RouterProvider router={router} />
                    </AuthLayout>
                </QueryClientProvider>
            </MsalProvider>
        </Provider>
    </React.StrictMode>,
);
