import TaskView from "@/components/TaskView";
import { GetActiveTheme, GetDates, GetTask } from "@/lib/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetTheme } from "../lib/api";
import { useQuery } from "react-query";
import CreateTask from "@/components/CreateTask";
import FetchError from "@/components/FetchError";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Indented from "@/components/IndentedText";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { redirect } from "react-router-dom";

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
        return (
            <main className="flex justify-center">
                <div
                    ref={animationRef}
                    className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2"
                >
                    {[0, 1, 2, 3, 4].map((key) => (
                        <Card key={key}>
                            <CardHeader className="relative">
                                <CardTitle className="flex gap-2 max-w-[90%] flex-wrap items-center">
                                    <Skeleton className="w-[250px] h-6" />
                                    <Skeleton className="w-8 h-4" />
                                </CardTitle>
                                <CardDescription>
                                    <Indented>
                                        <Skeleton className="w-[250px] h-6" />
                                    </Indented>
                                    <Indented>
                                        <Skeleton className="w-[250px] h-6" />
                                    </Indented>
                                </CardDescription>
                                <Skeleton className="top-4 right-4 w-8 h-8 absolute"></Skeleton>
                            </CardHeader>
                            <ScrollArea about="center" className="min-w-0">
                                <CardContent className="flex gap-2 justify-center items-center">
                                    {dates.map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="h-20 w-20 rounded-full"
                                        />
                                    ))}
                                    <ScrollBar orientation="horizontal" />
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    ))}
                </div>
            </main>
        );
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
        toast.error("No active theme found. Please Add a theme!");
        redirect("/themes");
        return <div></div>;
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
