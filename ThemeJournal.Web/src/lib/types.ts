import { UUID } from "uuidv7";

export type ObjectiveType = {
    id: string | null;
    description: string;
    colorId: number;
};

export type ThemeType = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
};

export enum TimeOfDay {
    Day1,
    Day2,
    Night,
}
export type TaskTypePost = {
    id: string;
    objectiveId: string | null;
    description: string;
    partialCompletion: string;
    fullCompletion: string;
    startDate: Date;
    endDate: Date;
};

export type TaskTypeGet = {
    id: string;
    description: string;
    partialCompletion: string;
    fullCompletion: string;
    progress?: Map<number, ProgressType>;
    startDate: Date;
    objectiveColor: number | null;
    objectiveDescription: string | null;
    endDate: Date;
};

export type GratitudesType = {
    id: UUID;
    description: string;
    createdAt: Date;
    sentiment: number;
    time: TimeOfDay;
};

export type ThoughtsType = {
    id: UUID;
    thought: string;
    createdAt: Date;
};

export type ProgressType = {
    id: string;
    taskId: string;
    completionDate: Date;
    progress: number;
};
