import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    PublicClientApplication,
    EventType,
    EventMessage,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./utils/authConfig.ts";

import AuthLayout from "./layout/AuthLayout.tsx";
import Root from "./pages/Root.tsx";
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
                element: <Root />,
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
        <MsalProvider instance={msalInstance}>
            <AuthLayout>
                <RouterProvider router={router} />
            </AuthLayout>
        </MsalProvider>
    </React.StrictMode>,
);
