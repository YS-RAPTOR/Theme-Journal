import { Button } from "./ui/button";
import { PiClockClockwiseBold, PiNotePencilDuotone } from "react-icons/pi";

import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "./ui/card";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

import { TaskTypeGet } from "@/lib/types";
import Indented from "./IndentedText";
import { FixDate, TransformDate } from "@/lib/api";
import TaskProgress from "./TaskProgress";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

// Add edit button to task. Allows to change the extend the end date.
const TaskView = (props: { task: TaskTypeGet; dates: Array<Date> }) => {
    const today = TransformDate(new Date());
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>{props.task.description}</CardTitle>
                <CardDescription>
                    <Indented>Partial: {props.task.partialCompletion}</Indented>
                    <Indented>Full: {props.task.fullCompletion}</Indented>
                </CardDescription>
                <div className="top-4 right-4 absolute">
                    {props.task.startDate > today ? (
                        <EditTaskView task={props.task} />
                    ) : (
                        <ExtendTaskView task={props.task} />
                    )}
                </div>
            </CardHeader>
            <ScrollArea>
                <CardContent className="flex gap-2 justify-center items-center">
                    {props.dates.map((date, index) => (
                        <TaskProgress
                            key={index}
                            date={date}
                            progress={props.task.progress?.get(date)}
                            disabled={
                                Math.abs(today.getTime() - date.getTime()) >= 10
                            }
                            none={
                                !(
                                    props.task.startDate <= date &&
                                    date < props.task.endDate
                                )
                            }
                        />
                    ))}
                    <ScrollBar orientation="horizontal" />
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

const EditTaskView = (props: { task: TaskTypePost }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button size="icon" variant="ghost">
                    <PiNotePencilDuotone className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Edit Task: {props.task.description}
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="submit"
                        // onClick={form.handleSubmit(onSubmit, (e) =>
                        //     console.log(e),
                        // )}
                        className="w-fit"
                    >
                        Edit Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ExtendTaskView = (props: { task: TaskTypePost }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button size="icon" variant="ghost">
                    <PiClockClockwiseBold className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Extend Task: {props.task.description}
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="submit"
                        // onClick={form.handleSubmit(onSubmit, (e) =>
                        //     console.log(e),
                        // )}
                        className="w-fit"
                    >
                        Extend Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskView;
