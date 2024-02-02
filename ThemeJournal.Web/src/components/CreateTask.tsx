import { PiPlusBold } from "react-icons/pi";
import { Button } from "./ui/button";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./ui/command";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import * as z from "zod";
import { uuidv7 } from "uuidv7";
import {
    CreateTask,
    FixDate,
    GetActiveTheme,
    GetObjectives,
    GetTheme,
    HandleError,
    TransformDate,
} from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { TaskTypePost } from "@/lib/types";
import CalendarField from "./CalendarField";

const CreateTaskView = (props: { currentTheme: string }) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const minDate = FixDate(TransformDate(new Date()));
    const NoObjectiveMessage = "No Objective";

    const ObjectivesQuery = useQuery({
        queryKey: ["objectives", props.currentTheme],
        queryFn: () => GetObjectives(props.currentTheme),
    });

    const ThemesQuery = useQuery({
        queryKey: ["currentThemes"],
        queryFn: () => GetTheme(null, TransformDate(new Date())),
    });

    const activeTheme = GetActiveTheme(ThemesQuery.data);

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

    const CreateTaskMutation = useMutation({
        // @ts-ignore
        mutationFn: CreateTask,
        onMutate: async (newTask: TaskTypePost) => {
            await queryClient.cancelQueries({ queryKey: ["currentTasks"] });

            const previousTasks = queryClient.getQueryData<TaskTypePost[]>([
                "currentTasks",
            ]);

            queryClient.setQueryData<TaskTypePost[]>(
                ["currentTasks"],
                [...previousTasks!, newTask],
            );

            return { previousTasks };
        },
        onError: (
            err: Error,
            _newTask: TaskTypePost,
            context: { previousTasks: TaskTypePost[] },
        ) => {
            queryClient.setQueryData(["currentTasks"], context!.previousTasks);
            HandleError(err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["currentTasks"] });
        },
    });

    const TaskSchema = z
        .object({
            id: z.string().uuid().default(uuidv7()),
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
                .refine((d) => d <= activeTheme!.endDate, {
                    message: "End date must be before the end of the theme",
                }),
        })
        .refine((data) => data.endDate > data.startDate, {
            message: "End date must be after start date",
            path: ["endDate"],
        });

    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            description: "",
            partialCompletion: "",
            objectiveId: null,
            fullCompletion: "",
        },
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (task: z.infer<typeof TaskSchema>) => {
        await CreateTaskMutation.mutateAsync(task as TaskTypePost);
        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="wide">
                    <PiPlusBold className="text-5xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Create New Task
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
                            <CalendarField
                                control={form.control}
                                label="Start Date"
                                name="startDate"
                                disabled={(date) =>
                                    date < minDate ||
                                    date > activeTheme!.endDate ||
                                    date >= form.getValues("endDate")
                                }
                                defaultMonth={minDate}
                            />
                            <CalendarField
                                control={form.control}
                                label="End Date"
                                name="endDate"
                                disabled={(date) =>
                                    date <= form.getValues("startDate") ||
                                    date < minDate ||
                                    date > activeTheme!.endDate
                                }
                                defaultMonth={minDate}
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
                        Create Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTaskView;
