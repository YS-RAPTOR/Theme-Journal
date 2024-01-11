import { PiPlusBold } from "react-icons/pi";

const WideButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="py-3 cursor-pointer flex justify-center w-full rounded-lg border-2 border-primaryDark bg-primarySuperLight text-primaryDark text-5xl"
        >
            <PiPlusBold />
        </div>
    );
};

export default WideButton;
