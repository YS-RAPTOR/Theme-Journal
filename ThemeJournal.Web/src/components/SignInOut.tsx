import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";

const SignInOut = () => {
    const { instance } = useMsal();

    const HandleLogin = () => {
        instance.loginRedirect(loginRequest).catch((error) => {
            console.log(error);
        });
    };

    const HandleLogout = () => {
        instance.logoutRedirect().catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
            <AuthenticatedTemplate>
                <button onClick={HandleLogout}>Sign Out</button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={HandleLogin}>Sign In</button>
            </UnauthenticatedTemplate>
        </>
    );
};

export default SignInOut;
