import { Outlet } from "react-router-dom";
import Profile from "../components/Profile";
import NavBar from "../components/NavBar";

const MainLayout = () => {
    return (
        <header className="backdrop:blur-md">
            <nav className="fixed h-16">
                <NavBar />
            </nav>
            <div className="fixed right-2 top-0 flex h-16 items-center">
                <Profile />
            </div>
            <hr className="border-1 fixed top-16 w-full border-t-2 border-primaryDark" />
            <Outlet />
        </header>
    );
};
export default MainLayout;
