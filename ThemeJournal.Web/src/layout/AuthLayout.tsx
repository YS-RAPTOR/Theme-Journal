import { ReactNode, useEffect } from "react";
import {
    IMsalContext,
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest } from "../utils/authConfig";
import Root from "../pages/Root";
import { axiosInstance } from "../utils/api";

const Layout = ({ children }: { children: ReactNode }) => {
    const { instance }: IMsalContext = useMsal();

    useEffect(() => {
        // Sets up interceptor to add bearer token to requests
        const inceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const response =
                        await instance.acquireTokenSilent(loginRequest);
                    config.headers.Authorization = `Bearer ${response.accessToken}`;
                } catch (e) {
                    instance.loginRedirect(loginRequest);
                }
                return config;
            },
        );

        return () => {
            axiosInstance.interceptors.request.eject(inceptor);
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
