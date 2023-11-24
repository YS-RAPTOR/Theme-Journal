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
import AuthWrapper from "./components/AuthWrapper.tsx";

import Root from "./pages/Root.tsx";
import ViewTasks from "./pages/ViewTasks.tsx";

import "./index.css";
import CreateTasks from "./pages/CreateTask.tsx";
import ThemeCreator from "./pages/ThemeCreator.tsx";
import GratitudeAndThoughts from "./pages/GratitudeAndThoughts.tsx";

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
        element: <Root />,
    },
    {
        path: "/see-tasks",
        element: <ViewTasks />,
    },
    {
        path: "/add-task",
        element: <CreateTasks />,
    },
    {
        path: "/create-theme",
        element: <ThemeCreator />,
    },
    {
        path: "/gratitudes-and-thoughts",
        element: <GratitudeAndThoughts />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <AuthWrapper>
                <RouterProvider router={router} />
            </AuthWrapper>
        </MsalProvider>
    </React.StrictMode>,
);
