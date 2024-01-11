const Indented = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-2">
            <div className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                *
            </div>
            <div className="flex items-center text-sm">{children}</div>
        </div>
    );
};

export default Indented;
