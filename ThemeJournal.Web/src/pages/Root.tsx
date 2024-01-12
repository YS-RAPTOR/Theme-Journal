import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../lib/authConfig";

const Root = () => {
    const { instance } = useMsal();
    const HandleLogin = () => {
        instance.loginRedirect(loginRequest).catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
            <div className="h-16"></div>
            <main className="flex justify-center bg-yellow-800 h-screen">
                <button onClick={HandleLogin}>
                    <div className="bg-yellow-500 p-4 rounded-lg text-white">
                        <h1 className="text-2xl">Login</h1>
                    </div>
                </button>
            </main>
        </>
    );
};

export default Root;
