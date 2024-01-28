import { Link } from "react-router-dom";
import {
    PiBookOpenTextDuotone,
    PiHouseDuotone,
    PiCompassDuotone,
} from "react-icons/pi";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "./ui/navigation-menu";

const Navigatons = [
    {
        Name: "Home",
        Path: "/",
        Icon: PiHouseDuotone,
        color: "bg-lime-100",
        hover: "bg-lime-200",
        selected: "bg-lime-200",
    },
    {
        Name: "Journal",
        Path: "/journal",
        Icon: PiBookOpenTextDuotone,
        color: "bg-teal-100",
        hover: "bg-teal-200",
        selected: "bg-teal-200",
    },
    {
        Name: "Theme",
        Path: "/theme",
        Icon: PiCompassDuotone,
        color: "bg-yellow-100",
        hover: "bg-yellow-200",
        selected: "bg-yellow-200",
    },
];

const NavBar = (props: { className?: string }) => {
    const location = useLocation();

    const InitialSelected = () => {
        for (let i = 0; i < Navigatons.length; i++) {
            if (Navigatons[i].Path === location.pathname) {
                return i;
            }
        }
        return -1;
    };

    const [selected, setSelected] = useState(InitialSelected());

    useEffect(() => {
        setSelected(InitialSelected());
    }, [location]);

    return (
        <NavigationMenu className={props.className}>
            <NavigationMenuList className="flex gap-2 h-12 items-end">
                {Navigatons.map((nav, index) => (
                    <NavigationMenuItem key={index}>
                        <Link to={nav.Path}>
                            <NavigationMenuLink
                                className={`sm:gap-2 border-t-2 border-r-2  sm:hover:h-12 hover:h-14 items-center justify-center flex-col sm:flex-row group inline-flex w-max rounded-tr-md ${
                                    selected == index
                                        ? `${nav.selected} h-14 sm:h-12`
                                        : `${nav.color} h-12 sm:h-10`
                                } px-4 py-2 text-sm font-medium transition-all hover:${
                                    nav.hover
                                } hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                                onClick={() => setSelected(index)}
                            >
                                <nav.Icon />
                                {nav.Name}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavBar;
