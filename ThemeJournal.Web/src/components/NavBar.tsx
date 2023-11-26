import NavIcon from "./NavIcon";
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

export default NavBar;
