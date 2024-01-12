import { useRef, useEffect } from "react";

export type TaskType = {
    id: string;
    objective: string;
    Description: string;
    PartialDescription: string;
    FullDescription: string;
    progress: number;
    startDate: Date;
    endDate: Date;
};

// Add edit button to task. Allows to change the extend the end date.
// Add the new task button. Allows to add a new task.
// Add task History button. Allows to see the history of the task.

const TaskList = (props: { tasks: Array<TaskType> }) => {
    const scrollRef = useRef(null as null | Map<string, HTMLElement>);

    const getMap = () => {
        if (!scrollRef.current) {
            scrollRef.current = new Map<string, HTMLElement>();
        }
        return scrollRef.current;
    };

    useEffect(() => {
        const map = getMap();
        for (const [key, value] of map) {
            value.scrollLeft = (value.scrollWidth - value.clientWidth) / 2;
            if (key === "0") {
                value.addEventListener("scroll", (e) => {
                    for (const [_, value] of map) {
                        const element = e!.target as HTMLElement;
                        value.scrollLeft = element.scrollLeft;
                    }
                });
            }
        }

        return () => {
            map.get("0")?.removeEventListener("scroll", (e) => {
                for (const [_, value] of map) {
                    const element = e!.target as HTMLElement;
                    value.scrollLeft = element.scrollLeft;
                }
            });
        };
    }, []);
    // ref={(node) => {
    //     const map = getMap();
    //     if (node) {
    //         // Add to the Map
    //         map.set("0", node);
    //     } else {
    //         // Remove from the Map
    //         map.delete("0");
    //     }
    // }}

    return (
        <div className=" flex max-w-[1054px] flex-auto flex-col gap-2 p-2 "></div>
    );
};

export default TaskList;
