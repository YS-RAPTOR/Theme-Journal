import { ReactNode, useEffect } from "react";
import {
    IMsalContext,
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest } from "../lib/authConfig";
import { GetTime, axiosInstance, timeStore } from "../lib/api";
import Root from "../pages/Root";

const Layout = ({ children }: { children: ReactNode }) => {
    const { instance }: IMsalContext = useMsal();
    const setTime = timeStore((state) => state.setTime);

    useEffect(() => {
        // Sets up interceptor to add bearer token to requests
        const inceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const response =
                        await instance.acquireTokenSilent(loginRequest);
                    config.headers.Authorization = `Bearer ${response.accessToken}`;
                    return config;
                } catch (e) {
                    instance.loginPopup(loginRequest);
                }
                return config;
            },
        );

        const interval = setInterval(async () => {
            try {
                const time = await GetTime();
                setTime(time);
                console.log("Time refreshed");
            } catch (e) {
                console.error(e);
            }
        }, 600000);

        return () => {
            axiosInstance.interceptors.request.eject(inceptor);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Root />
            </UnauthenticatedTemplate>
        </>
    );
};
export default Layout;
