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
};
export default MainLayout;
