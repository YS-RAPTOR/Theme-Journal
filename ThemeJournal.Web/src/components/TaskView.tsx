import { Button } from "./ui/button";
import {
    PiCalendarDuotone,
    PiClockClockwiseBold,
    PiNotePencilDuotone,
} from "react-icons/pi";

import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "./ui/card";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { TaskTypePost, TaskTypeGet, ThemeType } from "@/lib/types";
import Indented from "./IndentedText";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { FixDate, GetObjectives, ExtendTask, TransformDate } from "@/lib/api";
import { useQuery } from "react-query";
import TaskProgress from "./TaskProgress";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { colors } from "@/lib/constants";

const TaskView = (props: {
    task: TaskTypeGet;
    dates: Array<Date>;
    currentTheme: ThemeType;
}) => {
    const today = props.dates[3];
    const objectivesQuery = useQuery({
        queryKey: ["objectives", props.currentTheme.id],
        queryFn: () => GetObjectives(props.currentTheme.id),
    });

    // Update Progress

    const objectiveId =
        objectivesQuery.data?.find(
            (obj) =>
                obj.description == props.task.objectiveDescription &&
                obj.colorId == props.task.objectiveColor,
        )?.id ?? null;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 max-w-[90%] flex-wrap items-center">
                    {props.task.description}
                    {props.task.objectiveDescription &&
                        props.task.objectiveColor && (
                            <Badge
                                className={`bg-${
                                    colors[props.task.objectiveColor]
                                } hover:bg-${
                                    colors[props.task.objectiveColor]
                                }/80`}
                            >
                                {props.task.objectiveDescription}
                            </Badge>
                        )}
                </CardTitle>
                <CardDescription>
                    <Indented>Partial: {props.task.partialCompletion}</Indented>
                    <Indented>Full: {props.task.fullCompletion}</Indented>
                </CardDescription>
                <div className="top-4 right-4 absolute">
                    {props.task.startDate > today ? (
                        <EditTaskView
                            task={{ ...props.task, objectiveId: objectiveId }}
                        />
                    ) : (
                        <ExtendTaskView
                            task={props.task}
                            maxDate={props.currentTheme.endDate}
                        />
                    )}
                </div>
            </CardHeader>
            <ScrollArea about="center">
                <CardContent className="flex gap-2 justify-center items-center">
                    {props.dates.map((date, index) => (
                        <TaskProgress
                            key={index}
                            date={date}
                            progress={props.task.progress?.get(date)}
                            disabled={date !== today}
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

const ExtendTaskView = (props: { task: TaskTypeGet; maxDate: Date }) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

    const ExtendTaskMutation = useMutation({
        // @ts-ignore
        mutationFn: ExtendTask,
        onMutate: async (newTask: TaskTypeGet) => {
            await queryClient.cancelQueries({
                queryKey: ["currentTasks"],
            });

            const previousTasks = queryClient.getQueryData<TaskTypeGet[]>([
                "currentTasks",
            ]);

            const newTasks = [...previousTasks!];
            const index = newTasks.findIndex((task) => task.id == newTask.id);
            newTasks[index] = newTask;
            queryClient.setQueryData<TaskTypeGet[]>(["currentTasks"], newTasks);

            return { previousTasks };
        },
        onError: (
            _err: Error,
            _newTask: TaskTypeGet,
            context: { previousTasks: TaskTypeGet[] },
        ) => {
            queryClient.setQueryData(["currentTasks"], context!.previousTasks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentTasks"],
            });
        },
    });

    const minDate = FixDate(
        new Date(
            props.task.endDate.getFullYear(),
            props.task.endDate.getMonth(),
            props.task.endDate.getDate() + 1,
        ),
    );

    const maxDate = FixDate(props.maxDate);

    const ExtendSchema = z.object({
        endDate: z
            .date()
            .min(minDate, {
                message: "End Date must be after the current end date",
            })
            .refine((d) => d <= maxDate, {
                params: ["endDate"],
                message: "End Date must be within the current theme",
            }),
    });

    const form = useForm<z.infer<typeof ExtendSchema>>({
        resolver: zodResolver(ExtendSchema),
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (data: z.infer<typeof ExtendSchema>) => {
        await ExtendTaskMutation.mutateAsync({
            ...props.task,
            endDate: TransformDate(data.endDate),
        });
        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger>
                <Button size="icon" variant="ghost">
                    <PiClockClockwiseBold className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Extend Task: {props.task.description}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="p-3 max-h-[50vh] ">
                    <Form {...form}>
                        <form className="px-1 flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "P",
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <PiCalendarDuotone className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < minDate ||
                                                        date > maxDate
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit, (e) =>
                            console.log(e),
                        )}
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
