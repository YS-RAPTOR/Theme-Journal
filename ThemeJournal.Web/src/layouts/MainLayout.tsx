import { Outlet } from "react-router-dom";
import Profile from "../components/Profile";
import NavBar from "../components/NavBar";
import AuthLayout from "./AuthLayout";
import { Separator } from "@/components/ui/separator";

const MainLayout = () => {
    return (
        <>
            <header className="z-10">
                <div className="fixed top-0 h-16 w-full backdrop-blur-sm flex justify-between items-center">
                    <NavBar className="self-end" />
                    <div className="p-3">
                        <Profile />
                    </div>
                </div>
                <Separator className="fixed top-16" />
            </header>
            <AuthLayout>
                <Outlet />
            </AuthLayout>
        </>
    );

    return (
        <>
            <header>
                <div className="fixed top-0 z-10 h-16 w-full backdrop-blur-sm"></div>
                <nav className="fixed z-20 h-16">
                    <NavBar />
                </nav>
                <div className="fixed right-0 top-0 z-20 p-2 flex min-h-[4rem] items-center">
                    <Profile />
                </div>
                <hr className="border-1 fixed top-16 z-20 w-full border-t-2 border-primaryDark" />
            </header>
            <Outlet />
        </>
    );
};
export default MainLayout;
