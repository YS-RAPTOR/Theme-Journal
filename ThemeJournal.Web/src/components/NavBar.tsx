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
        className: "data-[active]:bg-lime-200 bg-lime-100 hover:bg-lime-200",
    },
    {
        Name: "Journal",
        Path: "/journal",
        Icon: PiBookOpenTextDuotone,
        className: "data-[active]:bg-teal-200 bg-teal-100 hover:bg-teal-200",
    },
    {
        Name: "Theme",
        Path: "/theme",
        Icon: PiCompassDuotone,
        className:
            "data-[active]:bg-yellow-200 bg-yellow-100 hover:bg-yellow-200",
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
            <NavigationMenuList className="flex h-12 items-end gap-2">
                {Navigatons.map((nav, index) => (
                    <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                            asChild
                            active={selected == index}
                            className={
                                "group inline-flex h-12 w-max flex-col items-center justify-center rounded-tr-md border-r-2 border-t-2 px-4 py-2 text-sm font-medium transition-all hover:h-14 hover:text-slate-900 focus:text-slate-900 focus:outline-none outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:h-14 sm:h-10 sm:flex-row sm:gap-2 sm:hover:h-12 data-[active]:sm:h-12 " +
                                nav.className
                            }
                            onClick={() => setSelected(index)}
                        >
                            <Link to={nav.Path}>
                                <nav.Icon />
                                {nav.Name}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavBar;
