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

const daysToDisplay = [1, 2, 3, 4, 5, 6, 7];

const TaskList = ({ props }: { props: Array<TaskType> }) => {
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

    return (
        <div className="flex max-w-[1054px] flex-auto flex-col gap-2 p-2 ">
            <div className="sticky top-[66px] z-10 grid grid-cols-10 items-center">
                <div className="col-span-5" />
                <div className="col-span-5">
                    <div
                        className="flex gap-2 overflow-scroll overscroll-none rounded-md border-2 border-primaryDark p-2 backdrop-blur-md"
                        ref={(node) => {
                            const map = getMap();
                            if (node) {
                                // Add to the Map
                                map.set("0", node);
                            } else {
                                // Remove from the Map
                                map.delete("0");
                            }
                        }}
                    >
                        {daysToDisplay.map((day) => {
                            return (
                                <div
                                    key={day}
                                    className="flex h-16 min-w-[4rem] flex-col items-center justify-center rounded-t-full border-2 border-primaryDark bg-primaryWhite"
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {props.map((task) => {
                return <Task props={task} key={task.id} getMap={getMap} />;
            })}
        </div>
    );
};

const Task = ({
    props,
    getMap,
}: {
    props: TaskType;
    getMap: () => Map<string, HTMLElement>;
}) => {
    return (
        <div className="grid w-full grid-cols-10 items-center">
            <div className="left-0 col-span-4 ">
                <div className="rounded-md border-2 border-primaryDark bg-primaryWhite p-1">
                    <div>{props.Description}</div>
                    <div className="flex gap-2">
                        <div className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                            *
                        </div>
                        <div className="flex items-center text-sm">
                            {props.PartialDescription}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                            *
                        </div>
                        <div className="flex items-center text-sm">
                            {props.FullDescription}
                        </div>
                    </div>
                </div>
            </div>
            <hr className="col-span-1 border-t-2 border-primaryDark"></hr>
            <div className="col-span-5">
                <div
                    className="flex gap-2 overflow-x-hidden rounded-md border-2 border-primaryDark p-2"
                    ref={(node) => {
                        const map = getMap();
                        if (node) {
                            // Add to the Map
                            map.set(props.id, node);
                        } else {
                            // Remove from the Map
                            map.delete(props.id);
                        }
                    }}
                >
                    {daysToDisplay.map((day) => {
                        return (
                            <div
                                key={day}
                                className="h-16 min-w-[4rem] rounded-full border-2 border-primaryDark"
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
