import TextArea from "../components/TextArea";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    GetGratitude,
    GetThought,
    UpsertGratitude,
    UpsertThought,
} from "../lib/api";
import { GratitudesType, ThoughtsType, TimeOfDay } from "../lib/types";
import Loading from "../components/Loading";
import FetchError from "../components/FetchError";
import { uuidv7obj } from "uuidv7";

const syncCharacters = 1;

const GetGratitudeByTime = (
    array: GratitudesType[],
    time: TimeOfDay,
): GratitudesType => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].time === time) {
            return array[i];
        }
    }
    return {
        id: uuidv7obj(),
        time: time,
        description: "",
        createdAt: new Date(),
        sentiment: 0,
    };
};

const Journal = () => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    const gratitudeQuery = useQuery({
        queryKey: ["todaysGratitudes"],
        queryFn: () => GetGratitude(tomorrow, today, null, null),
    });

    const thoughtsQuery = useQuery({
        queryKey: ["todaysThoughts"],
        queryFn: () => GetThought(tomorrow, today),
    });

    if (gratitudeQuery.isLoading || thoughtsQuery.isLoading) {
        return (
            <div className="flex h-screen">
                <div className="h-16"></div>
                <main className="flex w-full flex-auto flex-col">
                    <Loading />
                </main>
            </div>
        );
    }

    if (gratitudeQuery.isError || thoughtsQuery.isError) {
        return (
            <div className="flex h-screen">
                <div className="h-16"></div>
                <main className="flex w-full flex-auto flex-col ">
                    <FetchError />
                </main>
            </div>
        );
    }
    return (
        <JournalInner
            thoughtQuery={thoughtsQuery}
            gratitudeQuery={gratitudeQuery}
        />
    );
};

const JournalInner = ({
    thoughtQuery,
    gratitudeQuery,
}: {
    thoughtQuery: any;
    gratitudeQuery: any;
}) => {
    const queryClient = useQueryClient();

    const [day1Gratitude, setDay1Gratitude] = useState(
        GetGratitudeByTime(gratitudeQuery.data, TimeOfDay.Day1),
    );

    const [day2Gratitude, setDay2Gratitude] = useState(
        GetGratitudeByTime(gratitudeQuery.data, TimeOfDay.Day2),
    );

    const [nightGratitude, setNightGratitude] = useState(
        GetGratitudeByTime(gratitudeQuery.data, TimeOfDay.Night),
    );

    const GratitudeMutation = useMutation({
        //@ts-ignore
        mutationFn: UpsertGratitude,
        onMutate: async (newGratitude: GratitudesType) => {
            await queryClient.cancelQueries("todaysGratitudes");

            const previousGratitudes = queryClient.getQueryData<
                GratitudesType[]
            >(["todaysGratitudes"]);

            let updatedGratitudes: GratitudesType[] = [];
            for (let i = 0; i < previousGratitudes!.length; i++) {
                if (previousGratitudes![i].time === newGratitude.time) {
                    updatedGratitudes.push(newGratitude);
                } else {
                    updatedGratitudes.push(previousGratitudes![i]);
                }
            }

            queryClient.setQueryData<GratitudesType[]>(
                ["todaysGratitudes"],
                updatedGratitudes,
            );

            return { previousGratitudes };
        },
        onError: (
            _err,
            _newGratitude: GratitudesType,
            context: { previousGratitudes: GratitudesType[] },
        ) => {
            queryClient.setQueryData<GratitudesType[]>(
                ["todaysGratitudes"],
                context.previousGratitudes,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries(["todaysGratitudes"]);
        },
    });

    const [thoughts, setThoughts] = useState(
        thoughtQuery.data.length === 0
            ? {
                  id: uuidv7obj(),
                  thought: "",
                  createdAt: new Date(),
              }
            : thoughtQuery.data[0],
    );

    const ThoughtMutation = useMutation({
        //@ts-ignore
        mutationFn: UpsertThought,
        onMutate: async (newThought: ThoughtsType) => {
            await queryClient.cancelQueries("todaysThoughts");

            const previousThoughts = queryClient.getQueryData<ThoughtsType[]>([
                "todaysThoughts",
            ]);

            let updatedThoughts: ThoughtsType[] = [
                {
                    ...previousThoughts![0],
                    thought: newThought.thought,
                },
            ];

            queryClient.setQueryData<ThoughtsType[]>(
                ["todaysThoughts"],
                updatedThoughts,
            );

            return { previousThoughts };
        },
        onError: (
            _err: any,
            _newThought: ThoughtsType,
            context: { previousThoughts: ThoughtsType[] },
        ) => {
            queryClient.setQueryData<ThoughtsType[]>(
                ["todaysThoughts"],
                context.previousThoughts,
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries(["todaysThoughts"]);
        },
    });

    const HandleGratitudeChange = (
        value: string,
        current: GratitudesType,
        setValue: (vals: GratitudesType) => void,
        queryValue: string,
    ) => {
        const updated = {
            ...current,
            description: value,
        };
        setValue(updated);

        if (Math.abs(value.length - queryValue.length) >= syncCharacters) {
            GratitudeMutation.mutate(updated);
        }
    };

    return (
        <>
            <div className="h-16"></div>
            <main className="flex justify-center">
                <div className="flex w-full max-w-[1054px] flex-auto flex-col gap-4 p-2 ">
                    <div>
                        <label>
                            What are you feeling grateful for this morning?
                        </label>
                        <TextArea
                            value={day1Gratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    day1Gratitude,
                                    setDay1Gratitude,
                                    GetGratitudeByTime(
                                        gratitudeQuery.data,
                                        TimeOfDay.Day1,
                                    ).description,
                                );
                            }}
                            className="bg-yellow-300"
                        />
                    </div>
                    <div>
                        <label>
                            What is something else you are grateful for?
                        </label>
                        <TextArea
                            value={day2Gratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    day2Gratitude,
                                    setDay2Gratitude,
                                    GetGratitudeByTime(
                                        gratitudeQuery.data,
                                        TimeOfDay.Day2,
                                    ).description,
                                );
                            }}
                            className="bg-amber-300"
                        />
                    </div>
                    <div>
                        <label>What is on your mind?</label>
                        <TextArea
                            value={thoughts.thought}
                            rows={13}
                            onChange={(e: any) => {
                                const updated = {
                                    ...thoughts,
                                    thought: e.target.value,
                                };
                                setThoughts(updated);

                                const queryValue =
                                    thoughtQuery.data.length === 0
                                        ? ""
                                        : thoughtQuery.data[0].thought;

                                if (
                                    Math.abs(
                                        e.target.value.length -
                                            queryValue.length,
                                    ) >= syncCharacters
                                ) {
                                    ThoughtMutation.mutate(updated);
                                }
                            }}
                            className="bg-lime-300"
                        />
                    </div>
                    <div>
                        <label>
                            What are you feeling grateful for this evening?
                        </label>
                        <TextArea
                            value={nightGratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    nightGratitude,
                                    setNightGratitude,
                                    GetGratitudeByTime(
                                        gratitudeQuery.data,
                                        TimeOfDay.Night,
                                    ).description,
                                );
                            }}
                            className="bg-blue-300"
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Journal;
