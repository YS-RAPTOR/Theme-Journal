import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    GetGratitude,
    GetThought,
    HandleError,
    TransformDate,
    UpsertGratitude,
    UpsertThought,
    timeStore,
} from "../lib/api";
import { GratitudesType, ThoughtsType, TimeOfDay } from "../lib/types";
import FetchError from "../components/FetchError";
import { uuidv7obj } from "uuidv7";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
        createdAt: TransformDate(new Date()),
        sentiment: 0,
    };
};

const Journal = () => {
    const today = TransformDate(new Date());
    const tomorrow = new Date(today.getTime() + 86400000);
    const gratitudeQuery = useQuery({
        queryKey: ["todaysGratitudes"],
        queryFn: () => GetGratitude(tomorrow, today, null, null),
    });

    const thoughtsQuery = useQuery({
        queryKey: ["todaysThoughts"],
        queryFn: () => GetThought(tomorrow, today),
    });

    const time = timeStore((state) => state.time);

    if (
        gratitudeQuery.isLoading ||
        thoughtsQuery.isLoading ||
        time === undefined
    ) {
        return (
            <main className="flex justify-center">
                <div className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                What are you feeling grateful for this morning?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={4}
                                className="bg-yellow-200"
                            ></Textarea>
                        </CardContent>
                    </Card>
                    <Card className="p-2">
                        <CardHeader>
                            <CardTitle>
                                What is something else you are grateful for?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={4}
                                className="bg-amber-200"
                            ></Textarea>
                        </CardContent>
                    </Card>
                    <Card className="p-2">
                        <CardHeader>
                            <CardTitle>What is on your mind?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={8}
                                className="bg-lime-200"
                            ></Textarea>
                        </CardContent>
                    </Card>
                    <Card className="p-2">
                        <CardHeader>
                            <CardTitle>
                                What are you feeling grateful for this evening?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={4}
                                className="bg-blue-300"
                            ></Textarea>
                        </CardContent>
                    </Card>
                </div>
            </main>
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

    const [thoughts, setThoughts] = useState<ThoughtsType>(
        thoughtQuery.data.length === 0
            ? {
                  id: uuidv7obj(),
                  thought: "",
                  createdAt: TransformDate(new Date()),
              }
            : thoughtQuery.data[0],
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
            err,
            newGratitude: GratitudesType,
            context: { previousGratitudes: GratitudesType[] },
        ) => {
            queryClient.setQueryData<GratitudesType[]>(
                ["todaysGratitudes"],
                context.previousGratitudes,
            );

            const gratitude = context.previousGratitudes.find(
                (grat) => grat.id === newGratitude.id,
            );

            if (gratitude) {
                if (gratitude.time === TimeOfDay.Day1) {
                    setDay1Gratitude(gratitude);
                } else if (gratitude.time === TimeOfDay.Day2) {
                    setDay2Gratitude(gratitude);
                } else if (gratitude.time === TimeOfDay.Night) {
                    setNightGratitude(gratitude);
                }
            }

            HandleError(err);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["todaysGratitudes"]);
        },
    });

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
            err: any,
            newThought: ThoughtsType,
            context: { previousThoughts: ThoughtsType[] },
        ) => {
            queryClient.setQueryData<ThoughtsType[]>(
                ["todaysThoughts"],
                context.previousThoughts,
            );

            const thought = context.previousThoughts.find(
                (th) => th.id === newThought.id,
            );

            if (thought) {
                setThoughts(thought);
            }

            HandleError(err);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["todaysThoughts"]);
        },
    });

    const HandleGratitudeChange = (
        value: string,
        current: GratitudesType,
        setValue: (vals: GratitudesType) => void,
    ) => {
        const updated = {
            ...current,
            description: value,
        };
        setValue(updated);
        GratitudeMutation.mutate(updated);
    };

    return (
        <main className="flex justify-center">
            <div className="flex w-full max-w-[1054px] flex-auto flex-col gap-3 p-2 ">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            What are you feeling grateful for this morning?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={day1Gratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    day1Gratitude,
                                    setDay1Gratitude,
                                );
                            }}
                            className="bg-yellow-200"
                        ></Textarea>
                    </CardContent>
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <CardTitle>
                            What is something else you are grateful for?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={day2Gratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    day2Gratitude,
                                    setDay2Gratitude,
                                );
                            }}
                            className="bg-amber-200"
                        ></Textarea>
                    </CardContent>
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <CardTitle>What is on your mind?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={thoughts.thought}
                            rows={8}
                            onChange={(e: any) => {
                                const updated = {
                                    ...thoughts,
                                    thought: e.target.value,
                                };
                                setThoughts(updated);
                                ThoughtMutation.mutate(updated);
                            }}
                            className="bg-lime-200"
                        ></Textarea>
                    </CardContent>
                </Card>
                <Card className="p-2">
                    <CardHeader>
                        <CardTitle>
                            What are you feeling grateful for this evening?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={nightGratitude.description}
                            rows={4}
                            onChange={(e: any) => {
                                HandleGratitudeChange(
                                    e.target.value,
                                    nightGratitude,
                                    setNightGratitude,
                                );
                            }}
                            className="bg-blue-300"
                        ></Textarea>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Journal;
