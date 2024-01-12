import { useMutation, useQueryClient } from "react-query";
import { CreateObjectives, CreateTheme } from "../lib/api";
import { ThemeType, ObjectiveType } from "../lib/types";
import { uuidv7 } from "uuidv7";
import { PiPlusBold } from "react-icons/pi";
import { NumberOfColors, colors } from "../lib/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useFieldArray, useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogContentScroll,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { PiCalendarDuotone } from "react-icons/pi";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Cross2Icon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";
import { DialogPortal } from "@radix-ui/react-dialog";

const CreateThemeView = (props: { endDate: Date }) => {
    const queryClient = useQueryClient();
    const [animationRef, _] = useAutoAnimate();
    const [modalOpen, setModalOpen] = useState(false);

    const CreateThemeMutation = useMutation({
        // @ts-ignore
        mutationFn: CreateTheme,
        onMutate: async (newTheme: ThemeType) => {
            await queryClient.cancelQueries({ queryKey: ["currentThemes"] });

            const previousThemes = queryClient.getQueryData<ThemeType[]>([
                "currentThemes",
            ]);

            queryClient.setQueryData<ThemeType[]>(
                ["currentThemes"],
                [...previousThemes!, newTheme],
            );

            return { previousThemes };
        },
        onError: (
            _err: Error,
            _newTheme: ThemeType,
            context: { previousThemes: ThemeType[] },
        ) => {
            queryClient.setQueryData(
                ["currentThemes"],
                context!.previousThemes,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["currentThemes"] });
        },
    });

    const CreateObjectivesMutation = useMutation({
        // @ts-ignore
        mutationFn: CreateObjectives,
        onMutate: async (newObjectives: {
            themeId: string;
            objectives: Array<ObjectiveType>;
        }) => {
            await queryClient.cancelQueries({
                queryKey: ["objectives", newObjectives.themeId],
            });

            const previousObjectives = queryClient.getQueryData<
                ObjectiveType[]
            >(["objectives", newObjectives.themeId]);

            queryClient.setQueryData<ObjectiveType[]>(
                ["objectives", newObjectives.themeId],
                [...previousObjectives!, ...newObjectives.objectives],
            );

            return { previousObjectives };
        },
        onError: (
            _err: Error,
            newObjectives: {
                themeId: string;
                objectives: Array<ObjectiveType>;
            },
            context: { previousObjectives: ObjectiveType[] },
        ) => {
            queryClient.setQueryData(
                ["objectives", newObjectives.themeId],
                context!.previousObjectives,
            );
        },
        onSettled: (
            _data: any,
            _err: Error,
            newObjectives: {
                themeId: string;
                objectives: Array<ObjectiveType>;
            },
        ) => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", newObjectives.themeId],
            });
        },
    });

    const today = new Date();
    let minDate = today < props.endDate ? props.endDate : today;
    minDate.setHours(0, 0, 0, 0);

    const ObjectiveSchema = z.object({
        id: z.string().uuid().default(uuidv7()),
        description: z
            .string()
            .min(1, { message: "Description cannot be empty" })
            .max(255, {
                message: "Description cannot be longer than 255 chars",
            }),
        colorId: z.coerce.number().min(0).max(NumberOfColors),
    });

    const ThemeSchema = z
        .object({
            id: z.string().uuid().default(uuidv7()),
            title: z
                .string()
                .min(1, { message: "Title cannot be empty" })
                .max(255, { message: "Title cannot be longer than 255 chars" }),
            startDate: z.coerce
                .date({ required_error: "Start date is required" })
                .refine((d) => d >= minDate, {
                    message: "Start date must be in the future",
                }),
            endDate: z.coerce.date({ required_error: "End date is required" }),
            objectives: z.array(ObjectiveSchema),
        })
        .refine((data) => data.endDate >= data.startDate, {
            message: "End date must be after start date",
            path: ["endDate"],
        });

    const form = useForm<z.infer<typeof ThemeSchema>>({
        resolver: zodResolver(ThemeSchema),
        defaultValues: {
            title: "",
            objectives: [{ description: "Critical", colorId: 0 }],
        },
    });

    const {
        fields: objectiveFields,
        append: objectiveAppend,
        remove: objectiveRemove,
    } = useFieldArray({
        control: form.control,
        name: "objectives",
        keyName: "keyId",
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (theme: z.infer<typeof ThemeSchema>) => {
        // @ts-ignore
        await CreateThemeMutation.mutateAsync(theme as ThemeType);
        await CreateObjectivesMutation.mutateAsync({
            themeId: theme.id,
            objectives: theme.objectives as ObjectiveType[],
        });

        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger>
                <Button variant="default" size="wide">
                    <PiPlusBold className="text-5xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogTitle className=" text-xl font-black">
                    Create New Theme
                </DialogTitle>
                <ScrollArea className="p-3 max-h-[50vh] ">
                    <Form {...form}>
                        <form className="px-1 flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                                        date <
                                                            form.getValues(
                                                                "startDate",
                                                            ) || date < minDate
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <DialogTitle className="text-xl font-black">
                                Objectives
                            </DialogTitle>
                            <div className="px-4 flex flex-col gap-2">
                                {objectiveFields.map((field, index) => (
                                    <ObjectiveView
                                        key={field.keyId}
                                        canEdit={0 !== index}
                                        index={index}
                                        control={form.control}
                                        objective={field}
                                        deleteObjective={objectiveRemove}
                                    ></ObjectiveView>
                                ))}
                                <Button
                                    variant="secondary"
                                    size="wide"
                                    type="button"
                                    onClick={() =>
                                        objectiveAppend({
                                            id: uuidv7(),
                                            description: "",
                                            colorId: 1,
                                        })
                                    }
                                >
                                    <PiPlusBold className="text-2xl" />
                                </Button>
                            </div>
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
                        Create Theme
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ObjectiveView = (props: {
    canEdit: boolean;
    control?: Control<any>;
    deleteObjective: (index: number) => void;
    index: number;
    objective: any;
}) => {
    const [state, setState] = useState(1);
    if (!props.canEdit)
        return <ObjectiveViewConst objective={props.objective} />;

    return (
        <div
            className={`bg-${colors[state]} rounded-md p-2 flex flex-col gap-2`}
        >
            <FormField
                control={props.control}
                name={`objectives[${props.index}].description`}
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 space-y-0">
                        <div className="flex items-center justify-between">
                            <FormControl>
                                <Input
                                    className="h-fit rounded-none border-l-0 border-r-0 border-t-0 shadow-none outline-none focus-visible:border-slate-950 focus-visible:ring-0"
                                    {...field}
                                />
                            </FormControl>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-fit w-fit"
                                onClick={() =>
                                    props.deleteObjective(props.index)
                                }
                            >
                                <Cross2Icon />
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={props.control}
                name={`objectives[${props.index}].colorId`}
                render={({ field }) => (
                    <FormItem className="space-y-0">
                        <FormControl>
                            <RadioGroup
                                onValueChange={(e) => {
                                    setState(parseInt(e));
                                    field.onChange(e);
                                }}
                                defaultValue={field.value.toString()}
                                className="flex gap-2 flex-wrap justify-center"
                            >
                                {colors.map((color, index) => (
                                    <FormItem className="space-y-0" key={index}>
                                        <FormControl className="space-y-0 flex">
                                            <RadioGroupItem
                                                className={`bg-${color}`}
                                                value={index.toString()}
                                            />
                                        </FormControl>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
};

const ObjectiveViewConst = (props: { objective: any }) => {
    return (
        <div className={`bg-${colors[props.objective.colorId]} rounded-md p-2`}>
            <div className="flex w-full rounded-md bg-transparent px-3 py-1 text-sm ">
                {props.objective.description}
            </div>
        </div>
    );
};

export default CreateThemeView;
