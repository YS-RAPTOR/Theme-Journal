import { IconType } from "react-icons";
import { Link } from "react-router-dom";

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

export default NavIcon;
