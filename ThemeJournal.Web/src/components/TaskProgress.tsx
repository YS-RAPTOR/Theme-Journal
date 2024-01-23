import { ProgressType } from "@/lib/types";
import { useState } from "react";

const dataProgress = ["e", "p", "f"];

const TaskProgress = (props: {
    progress: ProgressType;
    disabled?: boolean;
    none?: boolean;
}) => {
    const disabled = props.disabled || false;

    if (props.none) {
        return (
            <div className="h-20 w-20 rounded-full border-2 border-transparent" />
        );
    }

    return (
        <button
            data-progress={dataProgress[props.progress.progress]}
            aria-disabled={disabled}
            className="h-20 w-20 rounded-full border-2 border-slate-900 bg-gradient-to-tl from-slate-950 to-transparent shadow transition-all hover:border-slate-200 aria-disabled:cursor-default aria-disabled:border-slate-700 aria-disabled:from-slate-700 data-[progress=e]:from-[0%] data-[progress=f]:from-[100%] data-[progress=p]:from-[49.5%] data-[progress=e]:to-[0%] data-[progress=f]:to-[100%] data-[progress=p]:to-[50.5%]"
        />
    );
};

export default TaskProgress;
