import { ObjectiveType } from "../lib/types";
import { NumberOfColors, colors } from "../lib/constants";
import { PiNotePencilDuotone, PiTrashDuotone } from "react-icons/pi";
import { useMutation, useQueryClient } from "react-query";
import { EditObjective, DeleteObjective } from "../lib/api";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uuidv7 } from "uuidv7";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const ObjectiveView = (props: {
    objectives: ObjectiveType[];
    themeId: string;
    index: number;
    canDelete: boolean;
    canEdit: boolean;
}) => {
    const queryClient = useQueryClient();

    const DeleteObjectiveMutation = useMutation({
        // @ts-ignore
        mutationFn: DeleteObjective,
        onMutate: async ({
            id,
            themeId,
            index,
        }: {
            id: string;
            themeId: string;
            index: number;
        }) => {
            await queryClient.cancelQueries({
                queryKey: ["objectives", themeId],
            });

            const previousObjectives = queryClient.getQueryData<
                ObjectiveType[]
            >(["objectives", themeId]);

            const newObjectives = [...previousObjectives!];
            newObjectives.splice(index, 1);

            queryClient.setQueryData<ObjectiveType[]>(
                ["objectives", themeId],
                newObjectives,
            );

            return { previousObjectives: previousObjectives };
        },
        onError: (
            _err: Error,
            _objectiveToDelete: { id: string; themeId: string; index: number },
            context: { previousObjectives: ObjectiveType[] },
        ) => {
            queryClient.setQueryData(
                ["objectives", props.themeId],
                context!.previousObjectives,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", props.themeId],
            });
        },
    });

    return (
        <>
            <div
                className={`flex w-full justify-between items-center rounded-lg bg-${
                    colors[props.objectives[props.index].colorId]
                } py-2 px-4 text-xl font-black `}
            >
                {props.objectives[props.index].description}
                <div className="flex gap-2">
                    {props.canEdit && (
                        <EditObjectiveView
                            objectives={props.objectives}
                            index={props.index}
                            themeId={props.themeId}
                        />
                    )}
                    {props.canDelete && (
                        <Button
                            onClick={() => {
                                DeleteObjectiveMutation.mutate({
                                    id: props.objectives[props.index].id,
                                    themeId: props.themeId,
                                    index: props.index,
                                });
                            }}
                            size="icon"
                            variant="ghost"
                        >
                            <PiTrashDuotone className="text-2xl" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

const EditObjectiveView = (props: {
    objectives: ObjectiveType[];
    index: number;
    themeId: string;
}) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const EditObjectiveMutation = useMutation({
        // @ts-ignore
        mutationFn: EditObjective,
        onMutate: async (newObjective: ObjectiveType) => {
            await queryClient.cancelQueries({
                queryKey: ["objectives", props.themeId],
            });

            const previousObjectives = queryClient.getQueryData<
                ObjectiveType[]
            >(["objectives", props.themeId]);

            const newObjectives = [...previousObjectives!];
            newObjectives[props.index] = newObjective;

            queryClient.setQueryData<ObjectiveType[]>(
                ["objectives", props.themeId],
                newObjectives,
            );

            return { previousObjectives: previousObjectives };
        },
        onError: (
            _err: Error,
            _newObjective: ObjectiveType,
            context: { previousObjectives: ObjectiveType[] },
        ) => {
            queryClient.setQueryData(
                ["objectives", props.themeId],
                context!.previousObjectives,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", props.themeId],
            });
        },
    });

    const ObjectiveSchema = z.object({
        id: z.string().uuid().default(uuidv7()),
        colorId: z.coerce.number().min(0).max(NumberOfColors),
    });

    const form = useForm<z.infer<typeof ObjectiveSchema>>({
        resolver: zodResolver(ObjectiveSchema),
        values: {
            id: props.objectives[props.index].id,
            colorId: props.objectives[props.index].colorId,
        },
    });

    const onSubmit = async (objective: z.infer<typeof ObjectiveSchema>) => {
        // @ts-ignore
        await EditObjectiveMutation.mutateAsync({
            id: objective.id,
            description: props.objectives[props.index].description,
            colorId: objective.colorId,
        });
        onModalOpenChange(false);
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
                        Edit Objective:{" "}
                        {props.objectives[props.index].description}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="p-3 max-h-[50vh] ">
                    <Form {...form}>
                        <form className="px-1 flex flex-col gap-3">
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
                        Edit Objective
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ObjectiveView;
