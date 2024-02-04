import {
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest } from "../lib/authConfig";
import { Link } from "react-router-dom";
import { PiGearDuotone, PiSignOutDuotone } from "react-icons/pi";
import { Button } from "./ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";

const Profile = () => {
    const { instance } = useMsal();
    const profileLetter = instance.getActiveAccount()?.name?.charAt(0);
    const [state, setState] = useState(false);

    const HandleLogin = () => {
        instance.loginPopup(loginRequest).catch((error) => {
            console.log(error);
        });
    };

    const HandleLogout = () => {
        setState(false);
        instance.logoutPopup().catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
            <AuthenticatedTemplate>
                <DropdownMenu open={state} onOpenChange={setState}>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarFallback>{profileLetter}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setState(false)}>
                            <Link
                                to="/settings"
                                className="gap-2 flex items-center"
                            >
                                <PiGearDuotone className="text-2xl" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={HandleLogout}
                            className="gap-2"
                        >
                            <PiSignOutDuotone className="text-2xl" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Button onClick={HandleLogin}>Sign In</Button>
            </UnauthenticatedTemplate>
        </>
    );
};

export default Profile;
