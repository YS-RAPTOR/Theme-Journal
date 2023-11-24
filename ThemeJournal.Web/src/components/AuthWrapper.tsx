import { ReactNode, useEffect } from "react";
import { IMsalContext, useMsal } from "@azure/msal-react";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
    const { instance, accounts }: IMsalContext = useMsal();

    // Runs on initial load
    useEffect(() => {
        if (accounts.length > 0) {
            // Sign in silently if we have an account
            instance
                .acquireTokenSilent({
                    scopes: [],
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
export default AuthWrapper;
