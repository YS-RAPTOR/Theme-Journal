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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { PiCalendarDuotone } from "react-icons/pi";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

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
        try {
            await ExtendThemeMutation.mutateAsync({
                id: props.theme.id,
                title: props.theme.title,
                startDate: props.theme.startDate,
                endDate: data.endDate,
            });
            onModalOpenChange(false);
        } catch (err) {
            HandleError(err);
        }
    };

    return (
        <Dialog onOpenChange={onModalOpenChange} open={modalOpen}>
            <DialogTrigger>
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
                                                    disabled={(date) => {
                                                        if (!maxDate) {
                                                            return (
                                                                date < minDate
                                                            );
                                                        } else {
                                                            return (
                                                                date <
                                                                    minDate ||
                                                                date > maxDate
                                                            );
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
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
                        Extend Theme
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExtendThemeView;
