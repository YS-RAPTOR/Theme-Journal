import { ThemeType } from "../lib/types";
import { PiClockClockwiseBold } from "react-icons/pi";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ExtendTheme, FixDate, HandleError } from "../lib/api";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Form } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import CalendarField from "./CalendarField";

const ExtendThemeView = (props: { theme: ThemeType; maxDate?: Date }) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

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

    const minDate = FixDate(
        new Date(
            props.theme.endDate.getFullYear(),
            props.theme.endDate.getMonth(),
            props.theme.endDate.getDate() + 1,
        ),
    );

    const currentThemes = queryClient.getQueryData<Array<ThemeType>>([
        "currentThemes",
    ]);

    const maxDate =
        currentThemes!.length > 1
            ? FixDate(currentThemes![1].startDate)
            : undefined;

    const ExtendSchema = z.object({
        endDate: z
            .date()
            .min(minDate, {
                message: "End Date must be after the current end date",
            })
            .refine(
                (d) => {
                    if (!maxDate) return true;
                    return d < maxDate;
                },
                {
                    params: ["endDate"],
                    message:
                        "End Date must be before the start of the next theme",
                },
            ),
    });

    const form = useForm<z.infer<typeof ExtendSchema>>({
        resolver: zodResolver(ExtendSchema),
    });

    const onModalOpenChange = (open: boolean) => {
        form.reset();
        setModalOpen(open);
    };

    const onSubmit = async (data: z.infer<typeof ExtendSchema>) => {
        await ExtendThemeMutation.mutateAsync({
            id: props.theme.id,
            title: props.theme.title,
            startDate: props.theme.startDate,
            endDate: data.endDate,
        });
        onModalOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <PiClockClockwiseBold className="text-2xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[99vh] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className=" text-xl font-black">
                        Extend Theme: {props.theme.title}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="p-3 max-h-[50vh] ">
                    <Form {...form}>
                        <form className="px-1 flex flex-col gap-3">
                            <CalendarField
                                control={form.control}
                                label="End Date"
                                name="endDate"
                                // @ts-ignore
                                disabledDays={(date) => {
                                    if (!maxDate) {
                                        return date < minDate;
                                    } else {
                                        return date < minDate || date > maxDate;
                                    }
                                }}
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
                        Extend Theme
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExtendThemeView;
