import { ReactNode, useEffect } from "react";
import { IMsalContext, useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";

const Layout = ({ children }: { children: ReactNode }) => {
    const { instance, accounts }: IMsalContext = useMsal();

    // Runs on initial load
    useEffect(() => {
        if (accounts.length > 0) {
            // Sign in silently if we have an account
            instance
                .acquireTokenSilent(loginRequest)
                .then((response) => {
                    console.log(response.accessToken);
                })
                .catch((error) => {
                    console.log(
                        "Could not login automatically. Error: ",
                        error,
                    );
                });
        }
    }, []);
    return <>{children}</>;
};
export default Layout;
