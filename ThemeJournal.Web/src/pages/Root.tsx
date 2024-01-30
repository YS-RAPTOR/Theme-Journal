import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../lib/authConfig";
import { Separator } from "@/components/ui/separator";
import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Root = () => {
    const { instance } = useMsal();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [embedWidth, setEmbedWidth] = useState(560);

    const HandleLogin = () => {
        instance.loginPopup(loginRequest).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        const setDimensions = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight - 64);

            if (window.innerWidth < 640) {
                setEmbedWidth(window.innerWidth - 64);
            }
        };
        setDimensions();
        window.addEventListener("resize", setDimensions);
        screen.orientation.addEventListener("change", setDimensions);

        return () => {
            window.removeEventListener("resize", setDimensions);
            screen.orientation.removeEventListener("change", setDimensions);
        };
    }, []);

    return (
        <>
            <header className="h-16 relative">
                <div className="absolute top-0 h-16 w-full flex justify-between items-center">
                    <div className="p-2 gap-2 flex items-center">
                        <img width="60px" src="/Logo.svg"></img>
                        <h1 className="font-black text-xl sm:text-2xl">
                            Theme Journal
                        </h1>
                    </div>
                    <div className="p-3">
                        <Profile />
                    </div>
                </div>
                <Separator className="absolute top-16" />
            </header>
            <main className="flex flex-col">
                <div className="flex min-h-[calc(100vh-4rem)] overflow-x-clip justify-between flex-col-reverse sm:flex-row w-full flex-auto">
                    <div className=" min-h-full p-5 items-center sm:items-start text-center sm:text-left gap-2 flex justify-center flex-col">
                        <h1 className="font-black text-4xl sm:text-5xl md:text-8xl">
                            Journal to your Hearts Content
                        </h1>
                        <p className="text-slate-500 text-lg sm:text-xl md:text-2xl">
                            Crafting a Life of Gratitude, Productivity, and
                            Purpose: Your Personal Journey Begins Here
                        </p>
                        <Button
                            onClick={HandleLogin}
                            size="lg"
                            className="w-fit"
                        >
                            Create an Account
                        </Button>
                    </div>
                    <img
                        width={width}
                        height={height}
                        alt="Hero Image"
                        src="/HeroImage.png"
                    ></img>
                </div>
                <div className="bg-slate-800 gap-4 flex p-5 py-10 flex-col text-center items-center">
                    {/*What Inspired Us (Embed CGP Grey Video (make clear not affiliated))*/}
                    <h1 className="font-black text-slate-50 text-2xl sm:text-3xl md:text-4xl">
                        What Inspired Me?
                    </h1>
                    <p className="text-slate-500 text-lg sm:text-xl md:text-2xl w-3/4">
                        The main inspiration for this project was CGP Grey's
                        video on Journaling. I wanted to create a simple and
                        easy to use journaling app that has similar features to
                        the one he uses in the video.
                    </p>
                    <embed
                        className="border-2"
                        width={embedWidth}
                        height={embedWidth * 0.5625}
                        src="https://www.youtube.com/embed/fSwpe8r50_o?si=DNdtjTcW949crJSq"
                        title="YouTube video player"
                        allow="accelerometer; allowfullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></embed>
                </div>
                <div className="gap-4 flex p-5 flex-col text-center items-center">
                    {/*Shout to create an account telling you to try it out*/}
                    <h1 className="font-black text-2xl sm:text-3xl md:text-4xl">
                        Sign up and Start Journaling Today!
                    </h1>
                    <Button onClick={HandleLogin} size="lg" className="w-fit">
                        Create an Account
                    </Button>
                </div>
            </main>
        </>
    );
};

// TODO: Add User Settings (Time)
// TODO: Sorting Tasks

export default Root;
