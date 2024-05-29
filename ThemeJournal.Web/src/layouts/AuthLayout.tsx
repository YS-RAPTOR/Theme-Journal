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

        return () => {
            axiosInstance.interceptors.request.eject(inceptor);
        };
    }, []);

    return (
        <>
            <AuthenticatedTemplate>
                <AutomaticallyGetTime>{children}</AutomaticallyGetTime>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Root />
            </UnauthenticatedTemplate>
        </>
    );
};

const AutomaticallyGetTime = (props: { children: React.ReactNode }) => {
    const setTime = timeStore((state) => state.setTime);

    useEffect(() => {
        const func = async () => {
            try {
                const time = await GetTime();
                setTime(time);
            } catch (e) {}
        };
        func();

        const interval = setInterval(func, 600000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    return <>{props.children}</>;
};

export default Layout;
