import { PiWarningDuotone } from "react-icons/pi";
const FetchError = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center text-2xl text-red-600 gap-2">
            <PiWarningDuotone className="text-5xl" />
            Error Fetching Data
        </div>
    );
};

export default FetchError;
