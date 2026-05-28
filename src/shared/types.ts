import { t } from "@rbxts/t";

// base application types

export type ApplicationCallback = { startApplication: (applicationId: string) => void };

export type ApplicationDetails = {
    id: string,
    name: string,
    description: string,
    isActive: boolean,
    isPublic: boolean,
    targetRankName: string,
    targetRankId: number,
    passPercentage: number,
    cooldownHours: number
};

const applicationDetailsInterface = {
    id: t.string,
    name: t.string,
    description: t.string,
    isActive: t.boolean,
    isPublic: t.boolean,
    targetRankName: t.string,
    targetRankId: t.number,
    passPercentage: t.number,
    cooldownHours: t.number
};

export const tApplicationDetails = t.interface(applicationDetailsInterface);

// question types (client/server)

type ApplicationQuestion = {
    id: string,
    order: number,
    questionText: string,
    questionType: string,
    isRequired: boolean,
    // points: number
}

type ServerApplicationQuestion = ApplicationQuestion & {
    correctAnswer: string,
    incorrectAnswers: string[]
}

export type ClientApplicationQuestion = ApplicationQuestion & {
    answers: string[]
}

export const tClientApplicationQuestion = t.interface({
    id: t.string,
    order: t.number,
    questionText: t.string,
    questionType: t.string,
    isRequired: t.boolean,
    // this shows up in the API docs but isn't returned?
    // points?: t.number,
    answers: t.array(t.string)
})

export type Application = ApplicationDetails & {
    questions: ServerApplicationQuestion[]
};

// marking types

export type ApplicationAnswer = { questionId: string, selectedAnswer: string };

const tApplicationAnswer = t.interface({
    questionId: t.string,
    selectedAnswer: t.string,
});

export type MarkingRequest = {
    applicationId: string,
    answers: ApplicationAnswer[]
}

export const tMarkingRequest = t.interface({
    applicationId: t.string,
    answers: t.array(tApplicationAnswer)
})

export type MarkingResult = { passed: boolean, score: number, rankName: string, errorMessage?: string };

export const tMarkingResult = t.interface({
    passed: t.boolean,
    score: t.number,
    rankName: t.string,
    errorMessage: t.optional(t.string)
});

// response types (for the server)

type BaseResponse = {
    success?: boolean,
    error?: string,
    code?: string,
};

export type ApplicationsResults = BaseResponse & { forms?: ApplicationDetails[] };
export type ApplicationResponse = BaseResponse & { form?: Application };