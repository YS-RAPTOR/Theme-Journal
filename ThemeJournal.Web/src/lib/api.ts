import axios from "axios";
import { QueryClient } from "react-query";
import * as Types from "./types";

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: "https://localhost:7181/api",
});

// Create query client
export const queryClient = new QueryClient();

export const FixDate = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return date;
};

const FixTime = (date: Date) => {
    const today = new Date();
    date.setHours(today.getHours(), today.getMinutes(), 0, 0);
    return date;
};

export const TransformDate = (date: Date) => {
    date.setHours(4, 0, 0, 0);
    return date;
};

export const GetDates = () => {
    // Get Dates from range -3 days to +3 days
    const dates = [];
    const DATERANGE = 3;
    const today = TransformDate(new Date());

    for (let i = -DATERANGE; i <= DATERANGE; i++) {
        dates.push(new Date(today.getTime() + i * 86400000));
    }
    return dates;
};

export const GetActiveTheme = (data: undefined | Types.ThemeType[]) => {
    if (data === undefined) {
        return null;
    }
    const today = new Date();
    return data.filter(
        (theme) => theme.startDate <= today && today < theme.endDate,
    )[0];
};

// All dates have to be local time zone. The functions will comvert to UTC before sending to the server.
type date = Date | null;

export const GetTheme = async (upperDate: date, lowerDate: date) => {
    let params: any = {};
    if (upperDate !== null) {
        params.upperDate = upperDate.toISOString();
    }
    if (lowerDate !== null) {
        params.lowerDate = lowerDate.toISOString();
    }

    return axiosInstance
        .get("/theme", {
            params: params,
        })
        .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].startDate = new Date(res.data[i].startDate);
                res.data[i].endDate = new Date(res.data[i].endDate);
            }

            res.data.sort((a: Types.ThemeType, b: Types.ThemeType) => {
                return a.startDate.getTime() - b.startDate.getTime();
            });

            return res.data as Array<Types.ThemeType>;
        });
};

export const CreateTheme = async ({
    id,
    title,
    startDate,
    endDate,
}: Types.ThemeType) => {
    const data = {
        id: id,
        title: title,
        startDate: FixTime(startDate).toISOString(),
        endDate: FixTime(endDate).toISOString(),
    };

    return axiosInstance.post("/theme", data).then((res) => {
        return res.data;
    });
};

export const EditTheme = async ({
    id,
    title,
    startDate,
    endDate,
}: Types.ThemeType) => {
    const data = {
        title: title,
        startDate: FixTime(startDate).toISOString(),
        endDate: FixTime(endDate).toISOString(),
    };
    return axiosInstance.put(`theme/${id}`, data).then((res) => {
        return res.data;
    });
};

export const ExtendTheme = async ({ id, endDate }: Types.ThemeType) => {
    return axiosInstance
        .put(`theme/${id}/extend`, FixTime(endDate).toISOString(), {
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
            return res.data;
        });
};

export const CreateObjectives = async ({
    themeId,
    objectives,
}: {
    themeId: string;
    objectives: Array<Types.ObjectiveType>;
}) => {
    return axiosInstance
        .post(`/ThemeObjective/${themeId}`, objectives)
        .then((res) => {
            return res.data;
        });
};

export const GetObjectives = async (id: string) => {
    return axiosInstance.get(`/ThemeObjective/${id}`).then((res) => {
        return res.data as Array<Types.ObjectiveType>;
    });
};

export const EditObjective = async (objective: Types.ObjectiveType) => {
    return axiosInstance
        .put(`/ThemeObjective/${objective.id}`, objective.colorId, {
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
            return res.data;
        });
};

export const DeleteObjective = async ({
    id,
    themeId,
    //@ts-ignore
    index,
}: {
    id: string;
    themeId: string;
    index: number;
}) => {
    return axiosInstance
        .delete(`/ThemeObjective/${themeId}/${id}`)
        .then((res) => {
            return res.data;
        });
};

export const GetGratitude = async (
    upperDate: date,

    lowerDate: date,
    time: Types.TimeOfDay | null,
    sentiment: number | null,
) => {
    let data: any = {};
    if (upperDate !== null) {
        data.upperDate = upperDate.toISOString();
    }
    if (lowerDate !== null) {
        data.lowerDate = lowerDate.toISOString();
    }
    if (time !== null) {
        data.time = time;
    }
    if (sentiment !== null) {
        data.sentiment = sentiment;
    }

    return axiosInstance.get("/gratitude", { params: data }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
            res.data[i].createdAt = new Date(res.data[i].createdAt);
        }
        return res.data as Array<Types.GratitudesType>;
    });
};

export const UpsertGratitude = async ({
    id,
    description,
    createdAt,
    sentiment,
    time,
}: Types.GratitudesType) => {
    const data = {
        description: description,
        createdAt: FixTime(createdAt).toISOString(),
        sentiment: sentiment,
        time: time,
    };

    return axiosInstance.put(`/gratitude/${id}`, data).then((res) => {
        return res.data;
    });
};

export const GetThought = async (upperDate: date, lowerDate: date) => {
    let data: any = {};
    if (upperDate !== null) {
        data.upperDate = upperDate.toISOString();
    }
    if (lowerDate !== null) {
        data.lowerDate = lowerDate.toISOString();
    }
    return axiosInstance.get("/thoughts", { params: data }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
            res.data[i].createdAt = new Date(res.data[i].createdAt);
        }
        return res.data as Array<Types.ThoughtsType>;
    });
};

export const UpsertThought = async ({
    id,
    thought,
    createdAt,
}: Types.ThoughtsType) => {
    const data = {
        thought: thought,
        createdAt: FixTime(createdAt).toISOString(),
    };

    return axiosInstance.put(`/thoughts/${id}`, data).then((res) => {
        return res.data;
    });
};

export const GetTask = async (upperDate: date, lowerDate: date) => {
    let params: any = {};
    if (upperDate !== null) {
        params.upperDate = upperDate.toISOString();
    }
    if (lowerDate !== null) {
        params.lowerDate = lowerDate.toISOString();
    }

    return axiosInstance
        .get("/Task", {
            params: params,
        })
        .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].startDate = new Date(res.data[i].startDate);
                res.data[i].endDate = new Date(res.data[i].endDate);
                const map = new Map();
                if (res.data[i].progress !== null) {
                    for (const item of res.data[i].progress) {
                        item.completionDate = new Date(item.completionDate);
                        map.set(item.completionDate.getTime(), item);
                    }
                }
                res.data[i].progress = map;
            }
            return res.data as Array<Types.TaskTypeGet>;
        });
};

export const CreateTask = async ({
    id,
    objectiveId,
    description,
    partialCompletion,
    fullCompletion,
    startDate,
    endDate,
}: Types.TaskTypePost) => {
    const data = {
        id: id,
        objectiveId: objectiveId,
        description: description,
        partialCompletion: partialCompletion,
        fullCompletion: fullCompletion,
        startDate: FixTime(startDate).toISOString(),
        endDate: FixTime(endDate).toISOString(),
    };
    console.log(data);
    return axiosInstance.post("/Task", data).then((res) => {
        return res.data;
    });
};

export const ExtendTask = async ({ id, endDate }: Types.TaskTypeGet) => {
    return axiosInstance
        .put(`Task/${id}/extend`, FixTime(endDate).toISOString(), {
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
            return res.data;
        });
};

export const EditTask = async ({ id, ...data }: Types.ThemeType) => {
    return axiosInstance.put(`Task/${id}`, data).then((res) => {
        return res.data;
    });
};

export const UpsertProgress = async ({ id, ...data }: Types.ProgressType) => {
    return axiosInstance.put(`progress/${id}`, data).then((res) => {
        return res.data;
    });
};
