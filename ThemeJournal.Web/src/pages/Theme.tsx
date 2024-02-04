import ThemeView from "../components/ThemeView";
import { ThemeType } from "../lib/types";
import { GetTheme, TransformDate, timeStore } from "../lib/api";
import { useQuery } from "react-query";
import FetchError from "../components/FetchError";
import CreateTheme from "../components/CreateTheme";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescriptionDiv,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";

const Theme = () => {
    const [animationRef, _animate] = useAutoAnimate<HTMLDivElement>();

    const ThemesQuery = useQuery({
        queryKey: ["currentThemes"],
        queryFn: () => GetTheme(null, TransformDate(new Date())),
    });

    const time = timeStore((state) => state.time);

    if (ThemesQuery.isLoading || time === undefined) {
        return (
            <main className="flex justify-center">
                <div
                    ref={animationRef}
                    className="flex w-full max-w-[1054px] flex-auto flex-col gap-2 p-2 "
                >
                    <Card>
                        <CardHeader className="relative">
                            <Skeleton className="w-[250px] h-10" />
                            <CardDescriptionDiv className="flex gap-2">
                                <Skeleton className="w-[100px] h-4" /> -
                                <Skeleton className="w-[100px] h-4" />
                            </CardDescriptionDiv>
                            {/* If Active can only extend else can edit*/}
                            <Skeleton className="top-4 right-4 w-8 h-8 absolute"></Skeleton>
                        </CardHeader>
                        <CardContent
                            ref={animationRef}
                            className="flex flex-col gap-2"
                        >
                            {[0, 1, 2, 3, 4].map((objective) => (
                                <Skeleton
                                    className="w-full h-12"
                                    key={objective}
                                ></Skeleton>
                            ))}
                        </CardContent>
                    </Card>
                    <Button variant="default" size="wide">
                        <PiPlusBold className="text-5xl" />
                    </Button>
                </div>
            </main>
        );
    }

    if (ThemesQuery.isError) {
        return (
            <div className="flex h-screen">
                <main className="flex w-full flex-auto flex-col ">
                    <FetchError />
                </main>
            </div>
        );
    }

    return (
        <main className="flex justify-center">
            <div
                ref={animationRef}
                className="flex w-full max-w-[1054px] flex-auto flex-col gap-2 p-2 "
            >
                {ThemesQuery.data!.map((theme: ThemeType) => (
                    <ThemeView key={theme.id.toString()} theme={theme} />
                ))}
                {ThemesQuery.data!.length <= 1 && (
                    <CreateTheme
                        endDate={
                            ThemesQuery.data!.length > 0
                                ? ThemesQuery.data![0].endDate
                                : TransformDate(new Date())
                        }
                    />
                )}
            </div>
        </main>
    );
};

export default Theme;
