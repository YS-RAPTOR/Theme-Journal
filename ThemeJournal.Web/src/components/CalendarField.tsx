import { useMediaQuery } from "@/lib/useMediaQuery";
import { Matcher } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { PiCalendarDuotone } from "react-icons/pi";
import { Button } from "./ui/button";
import { TransformDate } from "@/lib/api";
import { Control } from "react-hook-form";
import { useState } from "react";

const CalendarField = ({
    label,
    name,
    disabled,
    control,
    defaultMonth,
}: {
    label: string;
    name: string;
    disabled: (date: Matcher | Matcher[]) => boolean;
    control: Control<any>;
    defaultMonth: Date;
}) => {
    const isDesktop = useMediaQuery("(min-height: 700px)");
    const [state, setState] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                    <FormLabel>{label}</FormLabel>
                    {isDesktop ? (
                        <Popover open={state} onOpenChange={setState}>
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
                                            field.value.toLocaleDateString()
                                        ) : (
                                            <span>Pick a date</span>
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
                                    disabled={disabled}
                                    today={TransformDate(new Date())}
                                    defaultMonth={defaultMonth}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Drawer open={state} onOpenChange={setState}>
                            <DrawerTrigger asChild>
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
                                            field.value.toLocaleDateString()
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <PiCalendarDuotone className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </DrawerTrigger>
                            <DrawerContent className="p-0 justify-center">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={disabled}
                                    today={TransformDate(new Date())}
                                    defaultMonth={defaultMonth}
                                    initialFocus
                                />
                            </DrawerContent>
                        </Drawer>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default CalendarField;
