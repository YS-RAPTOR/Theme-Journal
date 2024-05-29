import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Button } from "@/components/ui/button";

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
                <Link to="/">
                    <Button size="lg">Go Home</Button>
                </Link>
            </main>
        </div>
    );
};
export default NotFound;
