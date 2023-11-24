import { LogLevel } from "@azure/msal-browser";

const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0;

export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_susi",
        editProfile: "B2C_1_edit",
    },
    authorities: {
        signUpSignIn: {
            authority:
                "https://ysraptorAuth.b2clogin.com/YSraptorAuth.onmicrosoft.com/B2C_1_susi",
        },
        editProfile: {
            authority:
                "https://YSraptorAuth.b2clogin.com/YSraptorAuth.onmicrosoft.com/b2c_1_edit",
        },
    },
    authorityDomain: "YSraptorAuth.b2clogin.com",
};

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AUTH_CLIENT_ID as string,
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE || isEdge || isFirefox,
    },
    system: {
        // allowNativeBroker: false,
        loggerOptions: {
            loggerCallback: (
                level: LogLevel,
                message: string,
                containsPii: boolean,
            ) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: [],
};
