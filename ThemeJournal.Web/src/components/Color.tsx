import { colors } from "../utils/constants";
import { ObjectiveType } from "../utils/types";

const Color = ({
    objectives,
    objectiveIndex,
    colorIndex,
    onClick,
}: {
    objectiveIndex: number;
    objectives: ObjectiveType[];
    colorIndex: number;
    onClick?: () => void;
}) => {
    const selectedStyles =
        colorIndex == objectives[objectiveIndex].colorId
            ? "border-primaryLight"
            : "cursor-pointer border-primaryWhite";
    return (
        <div
            className={`h-4 w-4 border-2 rounded-full bg-${colors[colorIndex]} ${selectedStyles}`}
            onClick={onClick}
        ></div>
    );
};

export default Color;
