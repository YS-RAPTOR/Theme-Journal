import { useMutation, useQueryClient } from "react-query";
import { CreateObjectives, CreateTheme } from "../utils/api";
import { UUID, uuidv7obj } from "uuidv7";
import { ThemeType, ObjectiveType } from "../utils/types";
import { RefObject, useRef } from "react";
import { PiXBold, PiPlusBold } from "react-icons/pi";
import { useState } from "react";
import { colors } from "../utils/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Color from "./Color";

type NullableThemeType = {
    id: UUID;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
};

const CreateThemeView = ({
    dialogRef,
    endDate,
}: {
    dialogRef: RefObject<HTMLDialogElement>;
    endDate: Date;
}) => {
    const queryClient = useQueryClient();
    const [animationRef, _] = useAutoAnimate();
    const endDateRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState<NullableThemeType>({
        id: uuidv7obj(),
        title: "",
        startDate: null,
        endDate: null,
    });

    const [objectives, setObjectives] = useState<ObjectiveType[]>([
        {
            id: uuidv7obj(),
            description: "Critical",
            colorId: 0,
        },
    ]);

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
            themeId: UUID;
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
                themeId: UUID;
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
            newObjectives: { themeId: UUID; objectives: Array<ObjectiveType> },
        ) => {
            queryClient.invalidateQueries({
                queryKey: ["objectives", newObjectives.themeId],
            });
        },
    });

    const today = new Date();
    const minDate = today < endDate ? endDate : today;
    const minDateStr = minDate.toISOString().split("T")[0];

    return (
        <form
            method="POST"
            className="flex flex-col gap-3 rounded border-2 border-primaryDark p-5"
            onSubmit={(e) => {
                e.preventDefault();
                //@ts-ignore
                e.target.reset();
                CreateThemeMutation.mutateAsync(theme as ThemeType).then(() => {
                    CreateObjectivesMutation.mutate({
                        themeId: theme.id,
                        objectives: objectives,
                    });
                });

                setTheme({
                    id: uuidv7obj(),
                    title: "",
                    startDate: null,
                    endDate: null,
                });
                setObjectives([
                    { id: uuidv7obj(), description: "Critical", colorId: 0 },
                ]);
                dialogRef.current!.close();
            }}
        >
            <div className="flex items-center justify-between text-xl">
                <div className=" font-black">Create Theme</div>
                <PiXBold
                    className="cursor-pointer"
                    onClick={() => {
                        dialogRef.current!.close();
                    }}
                />
            </div>
            <div className="flex h-2 w-full border-t-2 border-primaryLight"></div>
            <div className="flex flex-col gap-1">
                <label>Theme Title</label>
                <input
                    name="title"
                    placeholder="Enter theme title"
                    type="text"
                    autoFocus={true}
                    required={true}
                    value={theme.title}
                    maxLength={255}
                    onChange={(e) => {
                        setTheme({ ...theme, title: e.target.value });
                    }}
                    className="rounded border-none bg-primaryLightBackground px-2 py-1 shadow focus:ring-2 focus:ring-primaryLight"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label>Theme Duration</label>
                <div className="flex items-center gap-1">
                    <input
                        name="startDate"
                        type="date"
                        className="rounded border-none bg-primaryLightBackground px-2 py-1 text-xs shadow focus:ring-2 focus:ring-primaryLight sm:text-base"
                        min={minDateStr}
                        required={true}
                        onChange={(e) => {
                            theme.startDate = new Date(
                                e.target.value +
                                    "T" +
                                    minDate.toISOString().split("T")[1],
                            );
                            endDateRef.current!.min = e.target.value;
                            setTheme({ ...theme });
                        }}
                    />
                    <div className="text-lg">-</div>
                    <input
                        ref={endDateRef}
                        name="endDate"
                        type="date"
                        className="rounded border-none bg-primaryLightBackground px-2 py-1 text-xs shadow focus:ring-2 focus:ring-primaryLight sm:text-base"
                        required={true}
                        onChange={(e) => {
                            theme.endDate = new Date(
                                e.target.value +
                                    "T" +
                                    minDate.toISOString().split("T")[1],
                            );
                            setTheme({ ...theme });
                        }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between ">
                <div>Theme Objectives</div>
                <PiPlusBold
                    className="cursor-pointer"
                    onClick={() => {
                        setObjectives([
                            ...objectives,
                            { id: uuidv7obj(), description: "", colorId: 1 },
                        ]);
                    }}
                />
            </div>
            <div className="flex w-full border-b-2 border-primaryLight"></div>
            <div ref={animationRef} className="flex flex-col gap-3 p-2">
                {objectives.map((_, index) => {
                    return (
                        <ObjectiveView
                            key={index}
                            canEdit={index != 0}
                            index={index}
                            setObjectives={setObjectives}
                            objectives={objectives}
                        />
                    );
                })}
            </div>
            <div className="flex w-full border-b-2 border-primaryLight"></div>
            <div className="w-full flex items-center justify-center">
                <button className="text-xl rounded-md w-fit cursor-pointer border-2 border-primaryDark px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite">
                    Create Theme
                </button>
            </div>
        </form>
    );
};

const ObjectiveView = ({
    canEdit,
    index,
    objectives,
    setObjectives,
}: {
    canEdit: boolean;
    index: number;
    objectives: ObjectiveType[];
    setObjectives: React.Dispatch<React.SetStateAction<ObjectiveType[]>>;
}) => {
    const canEditStyles = canEdit ? "gap-2" : "";
    return (
        <div
            className={`flex w-full justify-center flex-col items-start rounded-lg bg-${
                colors[objectives[index].colorId]
            } ${canEditStyles} py-2 px-4 text-xl font-black `}
        >
            {canEdit ? (
                <div className="flex gap-3 w-full max-w-full justify-between items-center">
                    <input
                        name={`objective-${index}`}
                        placeholder="Enter objective"
                        type="text"
                        required={true}
                        value={objectives[index].description}
                        maxLength={255}
                        onChange={(e) => {
                            const newObjectives = [...objectives];
                            newObjectives[index].description = e.target.value;
                            setObjectives(newObjectives);
                        }}
                        className="border-b-2 border-0 border-primaryWhite placeholder-primaryWhite bg-inherit pt-1 p-0 focus:ring-0 flex flex-auto min-w-0 focus:border-primaryLight"
                    ></input>
                    <PiXBold
                        className="cursor-pointer min-w-fit"
                        onClick={() => {
                            // remove objective
                            const newObjectives = [...objectives];
                            newObjectives.splice(index, 1);
                            setObjectives(newObjectives);
                        }}
                    />
                </div>
            ) : (
                objectives[index].description
            )}
            <div className="flex w-full gap-2 items-center justify-center flex-wrap">
                {canEdit &&
                    colors.map((_, colorIndex) => {
                        return (
                            <Color
                                key={colorIndex}
                                objectives={objectives}
                                objectiveIndex={index}
                                colorIndex={colorIndex}
                                onClick={() => {
                                    objectives[index].colorId = colorIndex;
                                    setObjectives([...objectives]);
                                }}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default CreateThemeView;
