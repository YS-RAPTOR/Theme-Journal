import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import {
    PiBookOpenTextDuotone,
    PiHouseDuotone,
    PiCompassDuotone,
} from "react-icons/pi";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Navigatons = [
    {
        Name: "Home",
        Path: "/",
        Icon: PiHouseDuotone,
        color: "bg-lime-100",
        hover: "hover:bg-lime-200",
        selected: "bg-lime-200",
    },
    {
        Name: "Journal",
        Path: "/journal",
        Icon: PiBookOpenTextDuotone,
        color: "bg-teal-100",
        hover: "hover:bg-teal-200",
        selected: "bg-teal-200",
    },
    {
        Name: "Theme",
        Path: "/theme",
        Icon: PiCompassDuotone,
        color: "bg-yellow-100",
        hover: "hover:bg-yellow-200",
        selected: "bg-yellow-200",
    },
];

const NavBar = () => {
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

    return (
        <div className="flex h-full items-end gap-2">
            {Navigatons.map((nav, index) => {
                return (
                    <NavIcon
                        key={index}
                        name={nav.Name}
                        link={nav.Path}
                        Icon={nav.Icon}
                        selected={selected === index}
                        normalClasses={nav.color}
                        hoverClasses={nav.hover}
                        selectedClasses={nav.selected}
                        onClick={() => setSelected(index)}
                    />
                );
            })}
        </div>
    );
};

const NavIcon = ({
    name,
    link,
    selected,
    normalClasses,
    selectedClasses,
    hoverClasses,
    onClick,
    Icon,
}: {
    name: string;
    link: string;
    selected: boolean;
    normalClasses?: string;
    selectedClasses?: string;
    hoverClasses?: string;
    onClick?: () => void;
    Icon: IconType;
}) => {
    return (
        <Link
            to={link}
            onClick={onClick}
            className={
                (selected
                    ? "border-primaryLight py-2 text-primaryLight" +
                      " " +
                      selectedClasses +
                      " "
                    : "border-primaryDark py-1 text-primaryDark " +
                      " " +
                      normalClasses +
                      " ") +
                "flex flex-col items-center gap-0 rounded-tr-md border-r-2 border-t-2 px-2 transition-all hover:border-primaryLight hover:py-2 hover:text-primaryLight sm:flex-row sm:gap-4" +
                " " +
                hoverClasses
            }
        >
            <Icon></Icon>
            <div
                className={
                    // (selected ? "opacity-100" : "hidden opacity-0") +
                    " transition-all sm:block sm:opacity-100"
                }
            >
                {name}
            </div>
        </Link>
    );
};

export default NavBar;
