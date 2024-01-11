import { UUID } from "uuidv7";

export type ObjectiveType = {
    id: UUID;
    description: string;
    colorId: number;
};

export type ThemeType = {
    id: UUID;
    title: string;
    startDate: Date;
    endDate: Date;
};

export enum TimeOfDay {
    Day1,
    Day2,
    Night,
}

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
