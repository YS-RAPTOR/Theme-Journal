import { PiNotePencilDuotone } from "react-icons/pi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ObjectiveType, ThemeType } from "../lib/types";
import { GetObjectives, CreateObjectives, EditTheme } from "../lib/api";
import { colors } from "../lib/constants";
import ObjectiveView from "./ObjectiveView";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRef, RefObject } from "react";
import { uuidv7 } from "uuidv7";
import { PiXBold } from "react-icons/pi";
import Color from "./Color";
import { useState } from "react";
import ExtendTheme from "./ExtendTheme";
import FetchError from "./FetchError";
import Loading from "./Loading";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "./ui/card";

const ThemeView = (props: { theme: ThemeType }) => {
    const isThemeActive = () => {
        const today = new Date();
        return today >= props.theme.startDate && today < props.theme.endDate;
    };
    const objectivesQuery = useQuery({
        queryKey: ["objectives", props.theme.id],
        queryFn: () => GetObjectives(props.theme.id),
    });

    const [animationRef, _] = useAutoAnimate<HTMLDivElement>();

    if (objectivesQuery.isLoading) {
        return <Loading />;
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
                    {
                        // @ts-ignore
                        isThemeActive() ? (
                            <ExtendTheme theme={props.theme} />
                        ) : (
                            <PiNotePencilDuotone
                                className="text-primaryDark text-2xl cursor-pointer"
                                onClick={() => {
                                    EditThemeDialog.current!.showModal();
                                }}
                            />
                        )
                    }
                </div>
            </CardHeader>
            <CardContent ref={animationRef} className="flex flex-col gap-2">
                {objectivesQuery.data
                    ?.sort((a, b) => {
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
                {!isThemeActive() && <div></div>}
            </CardContent>
        </Card>
    );
};

const EditThemeView = ({
    props,
    dialogRef,
}: {
    props: ThemeType;
    dialogRef: RefObject<HTMLDialogElement>;
}) => {
    const [theme, setTheme] = useState<ThemeType>(props);
    const [isError, setError] = useState(false);
    const queryClient = useQueryClient();

    const endDate = queryClient.getQueryData(["currentThemes"])[0].endDate;
    const today = new Date();

    const minDate = today < endDate ? endDate : today;
    const minDateStr = minDate.toISOString().split("T")[0];

    const endDateRef = useRef<HTMLInputElement>(null);

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
            _err: Error,
            _newObjective: ThemeType,
            context: { previousThemes: ThemeType[] },
        ) => {
            queryClient.setQueryData(
                ["currentThemes"],
                context!.previousThemes,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["currentThemes"],
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
                EditThemeMutation.mutateAsync(theme)
                    .then(() => {
                        setError(false);
                        dialogRef.current!.close();
                        e.target.reset();
                    })
                    .catch(() => {
                        setError(true);
                    });
            }}
        >
            <div className="flex items-center justify-between text-xl">
                <div className=" font-black">Edit Theme</div>
                <PiXBold
                    className="cursor-pointer"
                    onClick={() => {
                        setTheme(props);
                        setError(false);
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
                        value={theme.startDate?.toISOString().split("T")[0]}
                        required={true}
                        onChange={(e) => {
                            setError(false);
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
                        value={theme.endDate?.toISOString().split("T")[0]}
                        className="rounded border-none bg-primaryLightBackground px-2 py-1 text-xs shadow focus:ring-2 focus:ring-primaryLight sm:text-base"
                        required={true}
                        onChange={(e) => {
                            setError(false);
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
            {isError && (
                <div className="text-red-600 text-xs xs:text-sm">
                    Theme Intersect with Another Theme
                </div>
            )}
            <div className="w-full flex items-center justify-center">
                <button className="text-xl rounded-md w-fit cursor-pointer border-2 border-primaryDark px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite">
                    Save Changes
                </button>
            </div>
        </form>
    );
};

const AddObjectiveView = ({
    dialogRef,
    themeId,
}: {
    dialogRef: RefObject<HTMLDialogElement>;
    themeId: string;
}) => {
    const [objective, setObjective] = useState<ObjectiveType>({
        id: uuidv7(),
        description: "",
        colorId: 0,
    });
    const queryClient = useQueryClient();

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
            console.log(previousObjectives);

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

    return (
        <form
            method="POST"
            className="flex flex-col gap-3 rounded border-2 border-primaryDark p-5"
            onSubmit={(e) => {
                e.preventDefault();
                dialogRef.current!.close();

                CreateObjectivesMutation.mutate({
                    themeId: themeId,
                    objectives: [objective],
                });

                setObjective({
                    id: uuidv7(),
                    description: "",
                    colorId: 0,
                });
            }}
        >
            <div className="flex items-center justify-between text-xl">
                <div className=" font-black">Create Objective</div>
                <PiXBold
                    className="cursor-pointer"
                    onClick={() => {
                        dialogRef.current!.close();
                        setObjective({
                            id: uuidv7(),
                            description: "",
                            colorId: 0,
                        });
                    }}
                />
            </div>
            <div
                className={`flex w-full justify-center gap-3 flex-col items-start rounded-lg bg-${
                    colors[objective.colorId]
                } py-2 px-4 text-xl font-black `}
            >
                <div className="flex w-full max-w-full justify-center items-center">
                    <input
                        name="objective"
                        placeholder="Enter objective"
                        type="text"
                        required={true}
                        value={objective.description}
                        maxLength={255}
                        onChange={(e) => {
                            setObjective({
                                ...objective,
                                description: e.target.value,
                            });
                        }}
                        className="border-b-2 border-0 border-primaryWhite placeholder-primaryWhite bg-inherit pt-1 p-0 focus:ring-0 flex flex-auto min-w-0 focus:border-primaryLight"
                    ></input>
                </div>
                <div className="flex w-full gap-2 items-center justify-center flex-wrap">
                    {colors.map((_, colorIndex) => {
                        return (
                            <Color
                                key={colorIndex}
                                objectives={[objective]}
                                objectiveIndex={0}
                                colorIndex={colorIndex}
                                onClick={() => {
                                    setObjective({
                                        ...objective,
                                        colorId: colorIndex,
                                    });
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <button className="text-xl rounded-md w-fit cursor-pointer border-2 border-primaryDark px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite">
                    Create Objective
                </button>
            </div>
        </form>
    );
};

export default ThemeView;
