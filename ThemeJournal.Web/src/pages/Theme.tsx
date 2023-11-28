import ThemeView from "../components/ThemeView";
import { ThemeType, ObjectiveType } from "../components/ThemeView";

const objectives: Array<ObjectiveType> = [
    {
        Description: "Objective 1",
        Color: "bg-red-200",
    },
    {
        Description: "Objective 2",
        Color: "bg-yellow-200",
    },
    {
        Description: "Objective 1",
        Color: "bg-red-200",
    },
    {
        Description: "Objective 2",
        Color: "bg-yellow-200",
    },
    {
        Description: "Objective 1",
        Color: "bg-red-200",
    },
    {
        Description: "Objective 2",
        Color: "bg-yellow-200",
    },
];

const theme: ThemeType = {
    Title: "Theme 1",
    StartDate: new Date("2023-11-01"),
    EndDate: new Date("2023-12-01"),
    Objectives: objectives,
};

const Theme = () => {
    return (
        <>
            <div className="h-16"></div>
            <main className="flex justify-center">
                <div className="flex max-w-[1054px] w-full flex-auto flex-col gap-2 p-2 ">
                    <ThemeView props={theme} />
                </div>
            </main>
        </>
    );
};
export default Theme;
