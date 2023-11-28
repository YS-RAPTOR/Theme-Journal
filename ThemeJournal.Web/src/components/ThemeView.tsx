import { PiNotePencilDuotone, PiFloppyDiskDuotone } from "react-icons/pi";

export type ObjectiveType = {
    Description: string;
    Color: string;
};
export type ThemeType = {
    Title: string;
    StartDate: Date;
    EndDate: Date;
    Objectives: Array<ObjectiveType>;
};

const ThemeView = ({ props }: { props: ThemeType }) => {
    return (
        <>
            <div className="border-2 flex flex-col flex-auto gap-2 border-primaryDark p-1 rounded-md">
                <div className="flex justify-between">
                    <div>
                        <div className="text-3xl">{props.Title}</div>
                        <div className="text-sm">
                            {props.StartDate.toLocaleDateString()} -{" "}
                            {props.EndDate.toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-around h-full ">
                        <PiNotePencilDuotone className="text-primaryDark text-2xl" />
                        <PiFloppyDiskDuotone className="text-primaryDark text-2xl" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {props.Objectives.map((objective) => {
                        return (
                            <div
                                className={
                                    objective.Color +
                                    " " +
                                    "p-2 border-2 border-primaryDark rounded-md "
                                }
                            >
                                {objective.Description}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ThemeView;
