const Button = ({
    className,
    onClick,
    Text,
}: {
    className?: string;
    onClick?: () => void;
    Text: string;
}) => {
    return (
        <button
            onClick={onClick}
            className={
                className +
                " " +
                "rounded-md w-fit cursor-pointer border-2 border-primaryDark px-2 py-1 text-primaryDark transition-all hover:border-primaryLight hover:bg-primaryDark hover:text-primaryLight hover:text-primaryWhite"
            }
        >
            {Text}
        </button>
    );
};

export default Button;
