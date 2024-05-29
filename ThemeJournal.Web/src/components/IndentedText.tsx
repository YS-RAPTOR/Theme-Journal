export const Indented = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-2">
            <p className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                *
            </p>
            <p className="flex items-center text-sm">{children}</p>
        </div>
    );
};

export const IndentedDiv = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-2">
            <div className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                *
            </div>
            <div className="flex items-center text-sm">{children}</div>
        </div>
    );
};
