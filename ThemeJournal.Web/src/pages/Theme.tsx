import Loading from "../components/Loading";
import ThemeView from "../components/ThemeView";
import { ThemeType } from "../lib/types";
import { GetTheme } from "../lib/api";
import { useQuery } from "react-query";
import FetchError from "../components/FetchError";
import CreateTheme from "../components/CreateTheme";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Theme = () => {
    const [animationRef, _animate] = useAutoAnimate<HTMLDivElement>();

    const ThemesQuery = useQuery({
        queryKey: ["currentThemes"],
        queryFn: () => GetTheme(null, new Date()),
    });

    if (ThemesQuery.isLoading) {
        return (
            <div className="flex h-screen">
                <div className="h-16"></div>
                <main className="flex w-full flex-auto flex-col">
                    <Loading />
                </main>
            </div>
        );
    }

    if (ThemesQuery.isError) {
        return (
            <div className="flex h-screen">
                <div className="h-16"></div>
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
                                : new Date()
                        }
                    />
                )}
            </div>
        </main>
    );
};

export default Theme;
