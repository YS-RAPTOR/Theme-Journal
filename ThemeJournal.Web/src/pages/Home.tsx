import TaskView from "@/components/TaskView";
import { GetActiveTheme, GetDates, GetTask } from "@/lib/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetTheme } from "../lib/api";
import { useQuery } from "react-query";
import CreateTask from "@/components/CreateTask";
import FetchError from "@/components/FetchError";

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

    if (ThemesQuery.isLoading || TasksQuery.isLoading) {
        // Show a loading screen if the themes are loading
        return <div>loading...</div>;
    }

    if (
        ThemesQuery.isError ||
        TasksQuery.isError ||
        TasksQuery.data === undefined
    ) {
        return (
            <div className="flex h-screen">
                <main className="flex w-full flex-auto flex-col ">
                    <FetchError />
                </main>
            </div>
        );
    }

    const activeTheme = GetActiveTheme(ThemesQuery.data);

    if (activeTheme === null) {
        // Redirect to the theme page if no theme is active
        return <div>loading...</div>;
    }

    return (
        <main className="flex justify-center">
            <div
                ref={animationRef}
                className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2"
            >
                {TasksQuery.data.map((task) => (
                    <TaskView
                        task={task}
                        dates={dates}
                        currentTheme={activeTheme}
                        key={task.id}
                    />
                ))}
                <CreateTask currentTheme={activeTheme.id} />
            </div>
        </main>
    );
};

export default Home;
