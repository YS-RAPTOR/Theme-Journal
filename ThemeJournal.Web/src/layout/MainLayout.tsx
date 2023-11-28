import { Outlet } from "react-router-dom";
import Profile from "../components/Profile";
import NavBar from "../components/NavBar";

const MainLayout = () => {
    return (
        <>
            <header>
                <div className="fixed top-0 z-10 h-16 w-full backdrop-blur-sm"></div>
                <nav className="fixed z-20 h-16">
                    <NavBar />
                </nav>
                <div className="fixed right-0 top-0 z-20 flex min-h-[4rem] items-center">
                    <Profile />
                </div>
                <hr className="border-1 fixed top-16 z-20 w-full border-t-2 border-primaryDark" />
            </header>
            <Outlet />
        </>
    );
};
export default MainLayout;
