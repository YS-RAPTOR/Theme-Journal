import { Button } from "./ui/button";
import {
    PiCalendarDuotone,
    PiClockClockwiseBold,
    PiNotePencilDuotone,
} from "react-icons/pi";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./ui/command";
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
import {
    TaskTypePost,
    TaskTypeGet,
    ThemeType,
    ProgressType,
} from "@/lib/types";
import Indented from "./IndentedText";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import {
    FixDate,
    GetObjectives,
    ExtendTask,
    TransformDate,
    EditTask,
    UpsertProgress,
    HandleError,
} from "@/lib/api";
import { useQuery } from "react-query";
import TaskProgress from "./TaskProgress";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { colors } from "@/lib/constants";
import { uuidv7 } from "uuidv7";
import { Skeleton } from "./ui/skeleton";

const TaskView = (props: {
    task: TaskTypeGet;
    currentTheme: ThemeType;
    dates: Array<Date>;
}) => {
    const today = props.dates[3];
    const objectivesQuery = useQuery({
        queryKey: ["objectives", props.currentTheme.id],
        queryFn: () => GetObjectives(props.currentTheme.id),
    });
    const queryClient = useQueryClient();

    const UpsertTaskProgress = useMutation({
        // @ts-ignore
        mutationFn: UpsertProgress,
        onMutate: async (progress: ProgressType) => {
            await queryClient.cancelQueries({
                queryKey: ["currentTasks"],
            });

            const previousTasks = queryClient.getQueryData<TaskTypeGet[]>([
                "currentTasks",
            ]);

            const newTasks: TaskTypeGet[] = [...previousTasks!];
            const index = newTasks.findIndex(
                (task) => progress.taskId == task.id,
            );

            newTasks[index].progress?.set(
                progress.completionDate.getTime(),
                progress,
            );

            queryClient.setQueryData<TaskTypeGet[]>(["currentTasks"], newTasks);

            return { previousTasks };
        },
        onError: (
            _err: Error,
            _progress: any,
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

    const objectiveId =
        objectivesQuery.data?.find(
            (obj) =>
                obj.description == props.task.objectiveDescription &&
                obj.colorId == props.task.objectiveColor,
        )?.id ?? null;

    if (objectivesQuery.isLoading) {
        return (
            <Card>
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
                        {props.dates.map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-20 w-20 rounded-full"
                            />
                        ))}
                        <ScrollBar orientation="horizontal" />
                    </CardContent>
                </ScrollArea>
            </Card>
        );
    }

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
                            currentTheme={props.currentTheme}
                        />
                    ) : (
                        <ExtendTaskView
                            task={props.task}
                            maxDate={props.currentTheme.endDate}
                        />
                    )}
                </div>
            </CardHeader>
            <ScrollArea about="center" className="min-w-0">
                <CardContent className="flex gap-2 justify-center items-center">
                    {props.dates.map((date, index) => (
                        <TaskProgress
                            key={index}
                            date={date}
                            onClick={() => {
                                const progress = props.task.progress?.get(
                                    date.getTime(),
                                );
                                try {
                                    if (progress) {
                                        UpsertTaskProgress.mutate({
                                            id: progress.id,
                                            taskId: props.task.id,
                                            progress:
                                                (progress.progress + 1) % 3,
                                            completionDate:
                                                progress.completionDate,
                                        });
                                    } else {
                                        UpsertTaskProgress.mutate({
                                            id: uuidv7(),
                                            taskId: props.task.id,
                                            progress: 1,
                                            completionDate: date,
                                        });
                                    }
                                } catch (err) {
                                    HandleError(err);
                                }
                            }}
                            progress={props.task.progress?.get(date.getTime())}
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

const EditTaskView = (props: {
    task: TaskTypePost;
    currentTheme: ThemeType;
}) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const minDate = FixDate(new Date());
    const NoObjectiveMessage = "No Objective";

    const ObjectivesQuery = useQuery({
        queryKey: ["objectives", props.currentTheme.id],
        queryFn: () => GetObjectives(props.currentTheme.id),
    });

    let CurrentObjectives = ObjectivesQuery.data?.filter(
        (obj) => obj.description != "Critical",
    );

    if (CurrentObjectives == undefined) {
        CurrentObjectives = [
            { id: null, description: NoObjectiveMessage, colorId: 0 },
        ];
    } else {
        CurrentObjectives.unshift({
            id: null,
            description: NoObjectiveMessage,
            colorId: 0,
        });
    }

    const EditTaskMutation = useMutation({
        // @ts-ignore
        mutationFn: EditTask,
        onMutate: async (newTask: TaskTypePost) => {
            await queryClient.cancelQueries({
                queryKey: ["currentTasks"],
            });

            const previousTasks = queryClient.getQueryData<TaskTypeGet[]>([
                "currentTasks",
            ]);

            const newTasks = [...previousTasks!];
            const index = newTasks.findIndex((task) => task.id == newTask.id);

            const objective = CurrentObjectives!.find(
                (obj) => obj.id == newTask.objectiveId,
            )!;

            const updatedTask =
                newTask.objectiveId == null
                    ? {
                          ...newTask,
                          objectiveDescription: null,
                          objectiveColor: null,
                      }
                    : {
                          ...newTask,
                          objectiveDescription: objective.description,
                          objectiveColor: objective.colorId,
                      };

            newTasks[index] = updatedTask;
            queryClient.setQueryData<TaskTypeGet[]>(["currentTasks"], newTasks);

            return { previousTasks };
        },
        onError: (
            _err: Error,
            _newTask: TaskTypePost,
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

    const TaskSchema = z
        .object({
            id: z.string().uuid(),
            objectiveId: z.string().uuid().nullable(),
            description: z
                .string()
                .min(1, { message: "Description cannot be empty" })
                .max(255, {
                    message: "Description cannot be longer than 255 chars",
                }),
            partialCompletion: z
                .string()
                .min(1, { message: "Partial description cannot be empty" })
                .max(255, {
                    message:
                        "Partial description cannot be longer than 255 chars",
                }),
            fullCompletion: z
                .string()
                .min(1, { message: "Full description cannot be empty" })
                .max(255, {
                    message: "Full description cannot be longer than 255 chars",
                }),
            startDate: z.coerce
                .date({ required_error: "Start date is required" })
                .refine((d) => d >= minDate, {
                    message: "Start date must be in the future",
                }),
            endDate: z.coerce
                .date({ required_error: "End date is required" })
                .refine((d) => d <= props.currentTheme.endDate, {
                    message: "End date must be before the end of the theme",
                }),
        })
        .refine((data) => data.endDate > data.startDate, {
            message: "End date must be after start date",
            path: ["endDate"],
        });

    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        values: { ...props.task },
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (task: z.infer<typeof TaskSchema>) => {
        try {
            await EditTaskMutation.mutateAsync(task as TaskTypePost);
            onModalOpenChange(false);
        } catch (err) {
            HandleError(err);
        }
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger>
                <Button size="icon" variant="ghost">
                    <PiNotePencilDuotone className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Edit New Task
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="p-3 max-h-[50vh] ">
                    <Form {...form}>
                        <form className="px-1 flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="partialCompletion"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>
                                            Partial Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="fullCompletion"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>Full Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="objectiveId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Objective</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-[200px] justify-between",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value
                                                            ? CurrentObjectives!.find(
                                                                  (obj) =>
                                                                      obj.id ==
                                                                      field.value,
                                                              )?.description
                                                            : NoObjectiveMessage}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search objectives..."
                                                        className="h-9"
                                                    />
                                                    <CommandEmpty>
                                                        No objective found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {CurrentObjectives!.map(
                                                            (obj) => (
                                                                <CommandItem
                                                                    value={
                                                                        obj.description
                                                                    }
                                                                    key={obj.id}
                                                                    onSelect={() => {
                                                                        form.setValue(
                                                                            "objectiveId",
                                                                            obj.id,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        obj.description
                                                                    }
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            obj.id ===
                                                                                field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0",
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>Start Date</FormLabel>
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
                                                        date < minDate
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                                        date <=
                                                            form.getValues(
                                                                "startDate",
                                                            ) ||
                                                        date < minDate ||
                                                        date >
                                                            props.currentTheme
                                                                .endDate
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
        try {
            await ExtendTaskMutation.mutateAsync({
                ...props.task,
                endDate: TransformDate(data.endDate),
            });
            onModalOpenChange(false);
        } catch (err) {
            HandleError(err);
        }
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
