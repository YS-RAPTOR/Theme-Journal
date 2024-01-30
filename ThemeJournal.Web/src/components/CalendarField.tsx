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

const CalendarField = ({
    label,
    name,
    disabled,
    control,
}: {
    label: string;
    name: string;
    disabled: (date: Matcher | Matcher[]) => boolean;
    control: Control<any>;
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                    <FormLabel>{label}</FormLabel>
                    {isDesktop ? (
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
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Drawer>
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
