import { RefObject } from "react";
import { ThemeType } from "../utils/types";
import { PiXBold } from "react-icons/pi";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ExtendTheme } from "../utils/api";

const ExtendThemeView = ({
    props,
    dialogRef,
}: {
    props: ThemeType;
    dialogRef: RefObject<HTMLDialogElement>;
}) => {
    const minDateStr = props.endDate.toISOString().split("T")[0];
    const [endDate, setEndDate] = useState<Date>(props.endDate);
    const queryClient = useQueryClient();
    const currentThemes = queryClient.getQueryData<Array<ThemeType>>([
        "currentThemes",
    ]);
    const maxDateStr =
        currentThemes!.length > 1
            ? currentThemes![1].startDate.toISOString().split("T")[0]
            : "";

    const ExtendThemeMutation = useMutation({
        // @ts-ignore
        mutationFn: ExtendTheme,
        onMutate: async (newTheme: ThemeType) => {
            await queryClient.cancelQueries({
                queryKey: ["currentThemes"],
            });

            const previousThemes = queryClient.getQueryData<ThemeType[]>([
                "currentThemes",
            ]);

            const newThemes = [...previousThemes!];
            newThemes[0] = newTheme;

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
                ExtendThemeMutation.mutate({
                    ...props,
                    endDate: endDate,
                });
                dialogRef.current!.close();
            }}
        >
            <div className="flex items-center justify-between text-xl">
                <div className=" font-black">Extend Theme: {props.title}</div>
                <PiXBold
                    className="cursor-pointer"
                    onClick={() => {
                        dialogRef.current!.close();
                    }}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label>Theme End Date</label>
                <div className="flex items-center gap-1">
                    <input
                        name="startDate"
                        type="date"
                        className="rounded border-none bg-primaryLightBackground px-2 py-1 shadow focus:ring-2 focus:ring-primaryLight text-base"
                        min={minDateStr}
                        max={maxDateStr}
                        value={endDate.toISOString().split("T")[0]}
                        required={true}
                        onChange={(e) => {
                            setEndDate(
                                new Date(
                                    e.target.value +
                                        "T" +
                                        props.endDate
                                            .toISOString()
                                            .split("T")[1],
                                ),
                            );
                        }}
                    />
                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <button className="text-xl rounded-md w-fit cursor-pointer border-2 border-primaryDark px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite">
                    Extend Theme
                </button>
            </div>
        </form>
    );
};

export default ExtendThemeView;
