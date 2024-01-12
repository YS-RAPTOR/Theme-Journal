import axios from "axios";
import { QueryClient } from "react-query";
import * as Types from "./types";

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: "https://localhost:7181/api",
});

// Create query client
export const queryClient = new QueryClient();

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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    };
    return axiosInstance.put(`theme/${id}`, data).then((res) => {
        return res.data;
    });
};

export const ExtendTheme = async ({ id, endDate }: Types.ThemeType) => {
    return axiosInstance
        .put(`theme/${id}/extend`, endDate.toISOString(), {
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
        createdAt: createdAt.toISOString(),
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
        createdAt: createdAt.toISOString(),
    };

    return axiosInstance.put(`/thoughts/${id}`, data).then((res) => {
        return res.data;
    });
};
