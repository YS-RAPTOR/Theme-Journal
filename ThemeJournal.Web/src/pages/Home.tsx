import TaskList from "../components/TaskList";
import { TaskType } from "../components/TaskList";

const tasks: Array<TaskType> = [
    {
        id: "1",
        objective: "Objective 1",
        Description: "Task 1",
        PartialDescription: "Task 1 Partial",
        FullDescription: "Task 1 Full",
        progress: 0,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2023-12-01"),
    },
    {
        id: "2",
        objective: "Objective 2",
        Description: "Task 2",
        PartialDescription: "Task 2 Partial",
        FullDescription: "Task 2 Full",
        progress: 0,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2023-12-01"),
    },
    {
        id: "3",
        objective: "Objective 1",
        Description: "Task 1",
        PartialDescription: "Task 1 Partial",
        FullDescription: "Task 1 Full",
        progress: 0,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2023-12-01"),
    },
    {
        id: "4",
        objective: "Objective 2",
        Description: "Task 2",
        PartialDescription: "Task 2 Partial",
        FullDescription: "Task 2 Full",
        progress: 0,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2023-12-01"),
    },
];

const Home = () => {
    return (
        <>
            <div className="h-16"></div>
            <main className="flex justify-center">
                <TaskList tasks={tasks} />
            </main>
        </>
    );
};

export default Home;
