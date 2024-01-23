import { Outlet } from "react-router-dom";
import Profile from "../components/Profile";
import NavBar from "../components/NavBar";
import AuthLayout from "./AuthLayout";
import { Separator } from "@/components/ui/separator";

const MainLayout = () => {
    return (
        <>
            <header className="z-20">
                <div className="z-20 fixed top-0 h-16 w-full backdrop-blur-sm flex justify-between items-center">
                    <NavBar className=" z-20 self-end" />
                    <div className="z-20 p-3">
                        <Profile />
                    </div>
                </div>
                <Separator className="z-20 fixed top-16" />
            </header>
            <AuthLayout>
                <div className="h-16"></div>
                <Outlet />
            </AuthLayout>
        </>
    );
};
export default MainLayout;
