import { ProgressType } from "@/lib/types";
import { format } from "date-fns";

const dataProgress = ["e", "p", "f"];

const TaskProgress = (props: {
    progress?: ProgressType;
    disabled: boolean;
    none: boolean;
    date: Date;
    onClick?: () => void;
}) => {
    const disabled = props.disabled || false;

    if (props.none) {
        return (
            <div className="h-20 w-20 rounded-full bg-slate-50 border-2 border-transparent" />
        );
    }

    const dateString1 = format(props.date, "E");
    const dateString2 = format(props.date, "dd");
    const dateString3 = format(props.date, "MMM");

    return (
        <button
            onClick={props.disabled ? undefined : props.onClick}
            data-progress={
                dataProgress[
                    props.progress != undefined ? props.progress.progress : 0
                ]
            }
            aria-disabled={disabled}
            className="h-20 w-20 text-sm rounded-full border-2 border-slate-900 bg-gradient-to-tl from-slate-950 to-transparent shadow transition-all hover:border-slate-200 aria-disabled:cursor-default aria-disabled:border-slate-500 aria-disabled:from-slate-500 data-[progress=e]:from-[0%] data-[progress=f]:from-[100%] data-[progress=p]:from-[49.5%] data-[progress=e]:to-[0%] data-[progress=f]:to-[100%] data-[progress=p]:to-[50.5%]"
        >
            <div
                data-progress={
                    dataProgress[
                        props.progress != undefined
                            ? props.progress.progress
                            : 0
                    ]
                }
                aria-disabled={disabled}
                className="mix-blend-difference text-slate-50 aria-disabled:text-stone-700"
            >
                {dateString1}
                <br />
                {dateString2}
                <br />
                {dateString3}
            </div>
        </button>
    );
};

export default TaskProgress;
