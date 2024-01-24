import TaskView from "@/components/TaskView";
import { GetDates, GetTask } from "@/lib/api";
import { TaskTypePost, ThemeType } from "@/lib/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetTheme } from "../lib/api";
import { useQuery } from "react-query";
import CreateTask from "@/components/CreateTask";

const GetActiveThemes = (data: undefined | ThemeType[]) => {
    if (data === undefined) {
        return null;
    }
    const today = new Date();
    return data.filter(
        (theme) => theme.startDate <= today && today < theme.endDate,
    )[0];
};

// Add the new task button. Allows to add a new task.
const Home = () => {
    const dates = GetDates();

    const [animationRef, _animate] = useAutoAnimate<HTMLDivElement>();

    const ThemesQuery = useQuery({
        queryKey: ["currentThemes"],
        queryFn: () => GetTheme(null, new Date()),
    });

    const TasksQuery = useQuery({
        queryKey: ["currentTasks"],
        queryFn: () => GetTask(dates[6], dates[0]),
    });

    const activeTheme = GetActiveThemes(ThemesQuery.data);

    if (activeTheme === null) {
        return <div></div>;
    }

    return (
        <main className="flex justify-center">
            <div
                ref={animationRef}
                className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2"
            >
                {TasksQuery.data.map((task) => (
                    <TaskView task={task} dates={dates} key={task.id} />
                ))}
                <CreateTask currentTheme={activeTheme.id} />
            </div>
        </main>
    );
};

export default Home;
