import { PiNotePencilDuotone, PiPlusBold } from "react-icons/pi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ObjectiveType, ThemeType } from "../lib/types";
import {
    GetObjectives,
    CreateObjectives,
    EditTheme,
    FixDate,
    HandleError,
    TransformDate,
} from "../lib/api";

import { NumberOfColors, colors } from "../lib/constants";
import ObjectiveView from "./ObjectiveView";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { uuidv7 } from "uuidv7";
import { useState } from "react";
import ExtendTheme from "./ExtendTheme";
import FetchError from "./FetchError";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
    CardDescriptionDiv,
} from "./ui/card";

import * as z from "zod";
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

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import CalendarField from "./CalendarField";

const ThemeView = (props: { theme: ThemeType }) => {
    const isThemeActive = () => {
        const today = TransformDate(new Date());
        return today >= props.theme.startDate && today < props.theme.endDate;
    };
    const objectivesQuery = useQuery({
        queryKey: ["objectives", props.theme.id],
        queryFn: () => GetObjectives(props.theme.id),
    });

    const [animationRef, _] = useAutoAnimate<HTMLDivElement>();

    if (objectivesQuery.isLoading) {
        return (
            <Card>
                <CardHeader className="relative">
                    <Skeleton className="w-[250px] h-10" />
                    <CardDescriptionDiv className="flex gap-2">
                        <Skeleton className="w-[100px] h-4" /> -
                        <Skeleton className="w-[100px] h-4" />
                    </CardDescriptionDiv>
                    {/* If Active can only extend else can edit*/}
                    <Skeleton className="top-4 right-4 w-8 h-8 absolute"></Skeleton>
                </CardHeader>
                <CardContent ref={animationRef} className="flex flex-col gap-2">
                    {[0, 1, 2, 3, 4].map((objective) => (
                        <Skeleton
                            className="w-full h-12"
                            key={objective}
                        ></Skeleton>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (objectivesQuery.isError) {
        return <FetchError />;
    }

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="text-2xl">{props.theme.title}</CardTitle>
                <CardDescription>
                    {" "}
                    {props.theme.startDate.toLocaleDateString()} -{" "}
                    {props.theme.endDate.toLocaleDateString()}
                </CardDescription>
                {/* If Active can only extend else can edit*/}
                <div className="top-4 right-4 absolute">
                    {isThemeActive() ? (
                        <ExtendTheme theme={props.theme} />
                    ) : (
                        <EditThemeView theme={props.theme} />
                    )}
                </div>
            </CardHeader>
            <CardContent ref={animationRef} className="flex flex-col gap-2">
                {objectivesQuery.data
                    ?.sort((a, b) => {
                        if (a.id == null || b.id == null) return 0;
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;
                    })
                    .map((objective, index) => {
                        return (
                            <ObjectiveView
                                themeId={props.theme.id}
                                objectives={objectivesQuery.data!}
                                index={index}
                                canDelete={
                                    !isThemeActive() &&
                                    objective.description != "Critical"
                                }
                                canEdit={objective.description != "Critical"}
                                key={index}
                            />
                        );
                    })}
                {!isThemeActive() && (
                    <AddObjectiveView themeId={props.theme.id} />
                )}
            </CardContent>
        </Card>
    );
};

const EditThemeView = (props: { theme: ThemeType }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const EditThemeMutation = useMutation({
        // @ts-ignore
        mutationFn: EditTheme,
        onMutate: async (newTheme: ThemeType) => {
            await queryClient.cancelQueries({
                queryKey: ["currentThemes"],
            });

            const previousThemes = queryClient.getQueryData<ThemeType[]>([
                "currentThemes",
            ]);

            const newThemes = [...previousThemes!];
            newThemes[1] = newTheme;

            queryClient.setQueryData<ThemeType[]>(["currentThemes"], newThemes);

            return { previousThemes };
        },
        onError: (
            err: Error,
            _newObjective: ThemeType,
            context: { previousThemes: ThemeType[] },
        ) => {
            queryClient.setQueryData(
                ["currentThemes"],
                context!.previousThemes,
            );
            HandleError(err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentThemes"],
            });
        },
    });

    // @ts-ignore
    const endDate = queryClient.getQueryData(["currentThemes"])[0].endDate;

    const today = TransformDate(new Date());
    const minDate = FixDate(today < endDate ? endDate : today);

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
        })
        .refine((data) => data.endDate > data.startDate, {
            message: "End date must be after start date",
            path: ["endDate"],
        });

    const form = useForm<z.infer<typeof ThemeSchema>>({
        resolver: zodResolver(ThemeSchema),
        values: {
            id: props.theme.id,
            title: props.theme.title,
            startDate: props.theme.startDate,
            endDate: props.theme.endDate,
        },
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (theme: z.infer<typeof ThemeSchema>) => {
        await EditThemeMutation.mutateAsync(theme);
        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <PiNotePencilDuotone className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Edit Theme: {props.theme.title}
                    </DialogTitle>
                </DialogHeader>
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
                            <CalendarField
                                control={form.control}
                                name="startDate"
                                label="Start Date"
                                disabled={(date) =>
                                    date < minDate ||
                                    date >= form.getValues("endDate")
                                }
                                defaultMonth={minDate}
                            />
                            <CalendarField
                                control={form.control}
                                name="endDate"
                                label="End Date"
                                disabled={(date) =>
                                    date <= form.getValues("startDate") ||
                                    date < minDate
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
                        Edit Theme
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AddObjectiveView = (props: { themeId: string }) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

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
            err: Error,
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
            HandleError(err);
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

    const form = useForm<z.infer<typeof ObjectiveSchema>>({
        resolver: zodResolver(ObjectiveSchema),
        defaultValues: {
            id: uuidv7(),
            description: "",
            colorId: 1,
        },
    });

    const onSubmit = async (objective: z.infer<typeof ObjectiveSchema>) => {
        await CreateObjectivesMutation.mutateAsync({
            themeId: props.themeId,
            objectives: [objective],
        });
        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="wide">
                    <PiPlusBold className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Add Objective
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
                                name="colorId"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                defaultValue={field.value.toString()}
                                                className="flex gap-2 flex-wrap justify-center"
                                            >
                                                {colors.map((color, index) => (
                                                    <FormItem
                                                        className="space-y-0"
                                                        key={index}
                                                    >
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
                        Create Objective
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ThemeView;
