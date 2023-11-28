import {
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiGearDuotone, PiSignOutDuotone } from "react-icons/pi";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Profile = () => {
    const { instance } = useMsal();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [animationParent, enableAnimation] = useAutoAnimate(
        (el, action, _, __) => {
            if (action === "add") {
                return new KeyframeEffect(
                    el,
                    [
                        { transform: "scale(.98)", opacity: 0 },
                        { transform: "scale(0.98)", opacity: 0, offset: 0.5 },
                        { transform: "scale(1)", opacity: 1 },
                    ],
                    {
                        duration: 75,
                        easing: "ease-in",
                    },
                );
            }
            if (action === "remove") {
                return new KeyframeEffect(
                    el,
                    [
                        {
                            transform: "scale(1)",
                            opacity: 1,
                        },
                        {
                            transform: "scale(.98)",
                            opacity: 0,
                        },
                    ],
                    {
                        duration: 50,
                        easing: "ease-out",
                    },
                );
            }
            return new KeyframeEffect(el, []);
        },
    );
    const profileLetter = instance.getActiveAccount()?.name?.charAt(0);

    const HandleLogin = () => {
        instance.loginRedirect(loginRequest).catch((error) => {
            console.log(error);
        });
    };

    const HandleLogout = () => {
        enableAnimation(false);
        instance.logoutRedirect().catch((error) => {
            console.log(error);
        });
    };

    const HandleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", HandleClickOutside);

        return () => {
            document.removeEventListener("click", HandleClickOutside);
        };
    }, []);

    return (
        <>
            <AuthenticatedTemplate>
                <div ref={menuRef} className="flex flex-col items-end">
                    <div className="flex h-16 w-16 items-center justify-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            key="ProfileButton"
                            className={
                                (menuOpen
                                    ? " bg-lime-100 text-primaryLight "
                                    : " text-primaryDark hover:bg-lime-50 ") +
                                "inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full "
                            }
                        >
                            <div
                                className={
                                    (menuOpen
                                        ? " border-primaryLight "
                                        : " border-primaryDark ") +
                                    "z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 bg-slate-200 text-4xl transition-colors hover:border-primaryLight  hover:text-primaryLight"
                                }
                            >
                                <div className="h-fit w-fit select-none font-bold">
                                    {profileLetter}
                                </div>
                            </div>
                        </button>
                    </div>
                    <div ref={animationParent}>
                        {menuOpen && (
                            <div
                                className="pr-2 pt-2 backdrop-blur-md"
                                key="ProfileDropDown"
                            >
                                <div className="flex w-max flex-col gap-1 rounded-md border-2 border-primaryDark p-2 text-primaryDark transition-colors">
                                    <Link
                                        to="/settings"
                                        className="flex cursor-pointer items-center justify-between gap-3  hover:text-primaryLight"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <PiGearDuotone className="text-2xl" />
                                        <div>Settings</div>
                                    </Link>
                                    <hr className="border-1 border-primaryDark" />
                                    <div
                                        onClick={HandleLogout}
                                        className="flex cursor-pointer items-center justify-between gap-3 hover:text-primaryLight"
                                    >
                                        <PiSignOutDuotone className="text-2xl" />
                                        <div>Sign Out</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div
                    onClick={HandleLogin}
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border-2 border-primaryDark bg-lime-100 px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-lime-200 hover:text-primaryLight"
                >
                    <div className="h-fit w-fit font-bold">Sign In</div>
                </div>
            </UnauthenticatedTemplate>
        </>
    );
};

export default Profile;
