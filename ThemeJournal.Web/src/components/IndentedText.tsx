const Indented = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="flex gap-2">
            <p className="flex min-w-[1rem] items-center justify-end text-lg font-black sm:min-w-[2.5rem]">
                *
            </p>
            <p className="flex items-center text-sm">{children}</p>
        </p>
    );
};

export default Indented;
