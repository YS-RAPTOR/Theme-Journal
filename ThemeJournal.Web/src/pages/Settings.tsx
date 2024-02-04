import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EditTime, HandleError, timeStore } from "@/lib/api";
import { editRequest } from "@/lib/authConfig";
import { TimeType } from "@/lib/types";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { PiArrowArcLeftDuotone } from "react-icons/pi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const { instance, inProgress } = useMsal();
    const EditProfile = () => {
        if (inProgress === InteractionStatus.None) {
            instance.acquireTokenPopup(editRequest);
        }
    };
    const account = instance.getActiveAccount();

    const timeString = timeStore((state) => state.timeString);
    const time = timeStore((state) => state.time);
    const setTime = timeStore((state) => state.setTime);

    const [newTime, setNewTime] = useState(timeString());

    useEffect(() => {
        setNewTime(timeString());
    }, [time]);

    const EditTimeMutation = useMutation({
        mutationFn: EditTime,
        onError(error) {
            HandleError(error);
        },
        onSuccess: (_old: any, data: TimeType) => {
            setTime(data);
        },
    });

    const submitTime = async () => {
        const [hours, minutes] = newTime.split(":");
        await EditTimeMutation.mutateAsync({
            hours: parseInt(hours),
            minutes: parseInt(minutes),
        });
    };

    const navigate = useNavigate();

    return (
        <main className="flex justify-center">
            <div className="flex w-full max-w-[750px] flex-auto flex-col gap-3 p-2">
                <Button
                    onClick={() => navigate(-1)}
                    size="icon"
                    variant="outline"
                >
                    <PiArrowArcLeftDuotone className="text-2xl" />
                </Button>
                <div></div>
                <div>
                    <h1>Profile Settings</h1>
                    <Separator />
                </div>
                <div className="flex gap-2 items-center">
                    Display Name :
                    <div className="bg-slate-200 rounded-md px-3 py-2 font-sans">
                        {account?.name}
                    </div>
                </div>
                <div className="self-end">
                    <Button size="sm" onClick={EditProfile}>
                        Edit Profile
                    </Button>
                </div>
                <div></div>
                <div>
                    <h1>App Settings</h1>
                    <Separator />
                </div>
                <div className="flex gap-2 items-center">
                    Day Start Time :{" "}
                    <Input
                        type="time"
                        className="w-fit"
                        value={newTime}
                        onChange={(e) => {
                            setNewTime(e.target.value);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                submitTime();
                            }
                        }}
                    />
                </div>
                <div className="self-end flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setNewTime(timeString);
                        }}
                        disabled={newTime === timeString()}
                        className="disabled:bg-transparent disabled:text-transparent disabled:shadow-none"
                    >
                        Cancel Changes
                    </Button>
                    <Button
                        size="sm"
                        onClick={submitTime}
                        disabled={newTime === timeString()}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default Settings;
