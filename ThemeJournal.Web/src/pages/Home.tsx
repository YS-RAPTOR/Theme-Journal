import { ProgressType } from "@/lib/types";
import TaskList from "../components/TaskList";
import { TaskType } from "../components/TaskList";
import TaskProgress from "@/components/TaskProgress";
import { Button } from "@/components/ui/button";

const tasks: Array<TaskType> = [
    {
        id: "1",
        objective: "Objective 1",
        Description: "Task 1",
        PartialDescription: "Task 1 Partial",
        FullDescription: "Task 1 Full",
        progress: 0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-26-01"),
    },
    {
        id: "2",
        objective: "Objective 2",
        Description: "Task 2",
        PartialDescription: "Task 2 Partial",
        FullDescription: "Task 2 Full",
        progress: 0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-24-01"),
    },
    {
        id: "3",
        objective: "Objective 1",
        Description: "Task 1",
        PartialDescription: "Task 1 Partial",
        FullDescription: "Task 1 Full",
        progress: 0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-02-01"),
    },
    {
        id: "4",
        objective: "Objective 2",
        Description: "Task 2",
        PartialDescription: "Task 2 Partial",
        FullDescription: "Task 2 Full",
        progress: 0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-02-01"),
    },
];

const Home = () => {
    const progresses: Array<ProgressType> = [
        {
            id: "1",
            taskId: "1",
            completionDate: new Date("2024-01-01"),
            progress: 0,
        },
        {
            id: "1",
            taskId: "1",
            completionDate: new Date("2024-01-01"),
            progress: 1,
        },
        {
            id: "1",
            taskId: "1",
            completionDate: new Date("2024-01-01"),
            progress: 2,
        },
    ];
    return (
        <main className="flex gap-2 p-2 flex-col justify-center">
            <TaskList tasks={tasks} />
        </main>
    );
};

export default Home;
