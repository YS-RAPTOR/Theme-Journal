import { useRef } from "react";
import Loading from "../components/Loading";
import ThemeView from "../components/ThemeView";
import { ThemeType } from "../utils/types";
import { GetTheme } from "../utils/api";
import { useQuery } from "react-query";
import WideButton from "../components/WideButton";
import FetchError from "../components/FetchError";
import CreateTheme from "../components/CreateTheme";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Theme = () => {
    const CreateThemeDialog = useRef<HTMLDialogElement>(null);
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
        <>
            <div className="h-16"></div>
            <main className="flex justify-center">
                <div
                    ref={animationRef}
                    className="flex w-full max-w-[1054px] flex-auto flex-col gap-2 p-2 "
                >
                    {ThemesQuery.data!.sort((a, b) => {
                        return a.startDate.getTime() - b.startDate.getTime();
                    }).map((theme: ThemeType) => {
                        return (
                            <ThemeView
                                key={theme.id.toString()}
                                props={theme}
                            />
                        );
                    })}
                    {ThemesQuery.data!.length <= 1 && (
                        <WideButton
                            onClick={() => {
                                CreateThemeDialog.current!.showModal();
                            }}
                        />
                    )}
                </div>
                <dialog
                    ref={CreateThemeDialog}
                    className="w-11/12 max-w-[1054px] rounded shadow-md shadow-primarySuperLight"
                >
                    <CreateTheme
                        dialogRef={CreateThemeDialog}
                        endDate={
                            ThemesQuery.data!.length > 0
                                ? ThemesQuery.data![0].endDate
                                : new Date()
                        }
                    />
                </dialog>
            </main>
        </>
    );
};

export default Theme;
