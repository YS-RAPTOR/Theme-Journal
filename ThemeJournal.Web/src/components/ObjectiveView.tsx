import { ObjectiveType } from "../utils/types";
import { colors } from "../utils/constants";
import { PiNotePencilDuotone, PiTrashDuotone, PiXBold } from "react-icons/pi";
import { RefObject, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import Color from "./Color";
import { UUID } from "uuidv7";
import { EditObjective, DeleteObjective } from "../utils/api";

const ObjectiveView = ({
    objectives,
    themeId,
    index,
    canDelete,
    canEdit,
}: {
    objectives: ObjectiveType[];
    themeId: UUID;
    index: number;
    canDelete: boolean;
    canEdit: boolean;
}) => {
    const EditObjectiveDialog = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();

    const DeleteObjectiveMutation = useMutation({
        // @ts-ignore
        mutationFn: DeleteObjective,
        onMutate: async ({
            id,
            themeId,
            index,
        }: {
            id: UUID;
            themeId: UUID;
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
            _objectiveToDelete: { id: UUID; themeId: UUID; index: number },
            context: { previousObjectives: ObjectiveType[] },
        ) => {
            queryClient.setQueryData(
                ["objectives", themeId],
                context!.previousObjectives,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", themeId],
            });
        },
    });

    return (
        <>
            <div
                className={`flex w-full justify-between items-center rounded-lg bg-${
                    colors[objectives[index].colorId]
                } py-2 px-4 text-xl font-black `}
            >
                {objectives[index].description}
                <div className="flex gap-2">
                    {canEdit && (
                        <PiNotePencilDuotone
                            className="text-primaryDark text-2xl cursor-pointer"
                            onClick={() => {
                                EditObjectiveDialog.current!.showModal();
                            }}
                        />
                    )}
                    {canDelete && (
                        <PiTrashDuotone
                            className="cursor-pointer text-primaryDark text-2xl"
                            onClick={() => {
                                DeleteObjectiveMutation.mutate({
                                    id: objectives[index].id,
                                    themeId: themeId,
                                    index: index,
                                });
                            }}
                        />
                    )}
                </div>
            </div>
            <dialog
                ref={EditObjectiveDialog}
                className="w-11/12 max-w-[1054px] rounded shadow-md shadow-primarySuperLight"
            >
                <EditObjectiveView
                    dialogRef={EditObjectiveDialog}
                    objectives={objectives}
                    index={index}
                    themeId={themeId}
                />
            </dialog>
        </>
    );
};

const EditObjectiveView = ({
    dialogRef,
    objectives,
    index,
    themeId,
}: {
    dialogRef: RefObject<HTMLDialogElement>;
    objectives: ObjectiveType[];
    index: number;
    themeId: UUID;
}) => {
    const queryClient = useQueryClient();
    const EditObjectiveMutation = useMutation({
        // @ts-ignore
        mutationFn: EditObjective,
        onMutate: async (newObjective: ObjectiveType) => {
            await queryClient.cancelQueries({
                queryKey: ["objectives", themeId],
            });

            const previousObjectives = queryClient.getQueryData<
                ObjectiveType[]
            >(["objectives", themeId]);

            const newObjectives = [...previousObjectives!];
            newObjectives[index] = newObjective;

            queryClient.setQueryData<ObjectiveType[]>(
                ["objectives", themeId],
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
                ["objectives", themeId],
                context!.previousObjectives,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", themeId],
            });
        },
    });

    return (
        <form
            method="POST"
            className="flex flex-col gap-3 rounded border-2 border-primaryDark p-5"
            onSubmit={(e) => {
                e.preventDefault();
                //@ts-ignore
                dialogRef.current!.close();
            }}
        >
            <div className="flex items-center justify-between text-xl">
                <div className=" font-black">
                    Edit Objective: {objectives[index].description}
                </div>
                <PiXBold
                    className="cursor-pointer"
                    onClick={() => {
                        dialogRef.current!.close();
                    }}
                />
            </div>
            <div className="flex w-full gap-2 items-center justify-center flex-wrap">
                {colors.map((_, i) => {
                    return (
                        <Color
                            key={i}
                            objectiveIndex={index}
                            objectives={objectives}
                            colorIndex={i}
                            onClick={() => {
                                dialogRef.current!.close();
                                EditObjectiveMutation.mutate({
                                    ...objectives[index],
                                    colorId: i,
                                });
                            }}
                        />
                    );
                })}
            </div>
        </form>
    );
};

export default ObjectiveView;
