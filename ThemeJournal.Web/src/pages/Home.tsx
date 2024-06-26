import TaskView from "@/components/TaskView";
import {
    GetActiveTheme,
    GetDates,
    GetTask,
    TransformDate,
    timeStore,
} from "@/lib/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetTheme } from "../lib/api";
import { useQuery } from "react-query";
import CreateTask from "@/components/CreateTask";
import FetchError from "@/components/FetchError";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescriptionDiv,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IndentedDiv } from "@/components/IndentedText";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeType } from "@/lib/types";

// Add the new task button. Allows to add a new task.
const Home = () => {
    const dates = GetDates();

    const [animationRef, _animate] = useAutoAnimate<HTMLDivElement>();

    const ThemesQuery = useQuery({
        queryKey: ["currentThemes"],
        queryFn: () => GetTheme(null, TransformDate(new Date())),
        onSuccess: (data: ThemeType[]) => {
            const activeTheme = GetActiveTheme(data) ?? null;
            if (activeTheme === null) {
                toast.error("No active theme found. Please Add a theme!");
            }
        },
    });

    const TasksQuery = useQuery({
        queryKey: ["currentTasks"],
        queryFn: () => GetTask(dates[6], dates[0]),
    });

    const navigate = useNavigate();
    const time = timeStore((state) => state.time);

    if (ThemesQuery.isLoading || TasksQuery.isLoading || time === undefined) {
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
                                <CardDescriptionDiv>
                                    <IndentedDiv>
                                        <Skeleton className="w-[250px] h-6" />
                                    </IndentedDiv>
                                    <IndentedDiv>
                                        <Skeleton className="w-[250px] h-6" />
                                    </IndentedDiv>
                                </CardDescriptionDiv>
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

    if (ThemesQuery.isError || TasksQuery.isError) {
        return (
            <div className="flex h-screen">
                <main className="flex w-full flex-auto flex-col ">
                    <FetchError />
                </main>
            </div>
        );
    }

    const activeTheme = GetActiveTheme(ThemesQuery.data) ?? null;

    if (activeTheme === null) {
        navigate("/theme");
        return <></>;
    }

    return (
        <main className="flex justify-center">
            <div
                ref={animationRef}
                className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2"
            >
                {TasksQuery.data!.map((task) => (
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
