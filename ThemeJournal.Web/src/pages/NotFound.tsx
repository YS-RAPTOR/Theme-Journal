import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const NotFound = () => {
    return (
        <div className="flex h-screen flex-col">
            <header className="border-b-2 border-primaryDark">
                <nav className="h-16">
                    <NavBar />
                </nav>
            </header>
            <main className="flex w-full flex-auto flex-col items-center justify-center gap-2">
                <div className="text-8xl font-black text-primaryDark">404</div>
                <div className="text-2xl font-black text-primaryLight">
                    Page Not Found
                </div>
                <Link
                    className="rounded-md border-2 border-primaryDark px-2 py-1 text-xl text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite"
                    to="/"
                >
                    Go Home
                </Link>
            </main>
        </div>
    );
};
export default NotFound;
