import { useEffect, useRef } from "react";

const TextArea = ({
    value,
    rows,
    placeholder,
    onChange,
    className,
}: {
    value: string;
    onChange: (e: any) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textAreaRef.current!.style.height = "auto";
        textAreaRef.current!.style.height =
            textAreaRef.current!.scrollHeight + "px";
    }, [value]);

    return (
        <textarea
            ref={textAreaRef}
            className={`${className} w-full overflow-y-hidden resize-none rounded-md border-primaryDark focus:border-none focus:ring-2 focus:ring-primaryLight`}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        ></textarea>
    );
};

export default TextArea;
