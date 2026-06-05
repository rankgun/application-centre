import "@rbxts-js/react";
import React, { StrictMode, useState } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, StarterGui, LogService } from "@rbxts/services";
import BannerNotify from "@rbxts/banner-notify";

import { remotes } from "shared/remotes";
import { ClientApplicationQuestion, ApplicationAnswer } from "shared/types";

import Layout from "./components/Layout";
import TitleBar from "./components/TitleBar";
import ApplicationList from "./components/ApplicationList";
import ProgressBar from "./components/ProgressBar";
import AnswersBox from "./components/AnswersBox";
import ApplicationResult from "./components/ApplicationResult";
import LoadingIcon from "./components/LoadingIcon";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
const root = createRoot(new Instance("Folder"));

type AppState =
    | { phase: "loading" }
    | { phase: "list" }
    | { phase: "questions", questions: ClientApplicationQuestion[], applicationId: string }
    | { phase: "result", passed: boolean, score: number, rankName: string, errorMessage?: string };

const AppLayout = ({ children }: React.PropsWithChildren) => (
    <screengui IgnoreGuiInset={true} ZIndexBehavior={"Sibling"}>
        <Layout>
            {children}
        </Layout>
    </screengui>
);

function CentreGui() {
    const [appState, setAppState] = useState<AppState>({ phase: "list" });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAnswers, setCurrentAnswers] = useState<ApplicationAnswer[]>([]);

    const startApplication = (applicationId: string) => {
        setCurrentQuestion(0);
        setCurrentAnswers([]);
        setAppState({ phase: "loading" });

        remotes.getApplicationQuestions(applicationId).then((questions) => {
            if (questions && questions.size() > 0) {
                setAppState({ phase: "questions", questions, applicationId });
            } else {
                setAppState({ phase: "list" });
            }
        });
    };

    const submitAnswer = (questionId: string, selectedAnswer: string) => {
        if (appState.phase !== "questions") return;
        const { questions, applicationId } = appState;

        const newAnswer: ApplicationAnswer = { questionId, selectedAnswer };
        const isLast = currentQuestion + 1 >= questions.size();

        setCurrentAnswers((prev) => {
            const updated = [...prev, newAnswer];
            if (isLast) {
                setAppState({ phase: "loading" });
                remotes.markApplication({ answers: updated, applicationId }).then((result) =>
                    setAppState({ phase: "result", ...result })
                );
            }
            return updated;
        });

        if (!isLast) setCurrentQuestion((q) => q + 1);
    }

    if (appState.phase === "list") {
        return (
            <AppLayout>
                <TitleBar title="Select your application" subtitle="Application Centre" />
                <ApplicationList startApplication={startApplication} />
            </AppLayout>
        );
    }

    if (appState.phase === "result") {
        return (
            <AppLayout>
                <TitleBar title="Your results" subtitle="Application Centre" />
                <ApplicationResult {...appState} listCallback={() => setAppState({ phase: "list" })} />
            </AppLayout>
        );
    }

    if (appState.phase === "loading") {
        return (
            <AppLayout>
                <frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
                    <uipadding PaddingTop={new UDim(0.3, 0)} />
                    <LoadingIcon Size={new UDim2(1, 0, 0.18, 0)} />
                </frame>
            </AppLayout>
        )
    }

    const { questions } = appState;
    const question = questions[currentQuestion];

    return (
        <AppLayout>
            <TitleBar
                title={question.questionText}
                subtitle={`Question ${currentQuestion + 1}`}
            />
            <AnswersBox
                questionId={question.id}
                answers={question.answers}
                onAnswer={submitAnswer}
            />
            <ProgressBar progress={currentQuestion / questions.size()} />
        </AppLayout>
    );
}

function DisableGui() {
    task.spawn(() => {
        let success = false;
        while (!success) {
            try {
                StarterGui.SetCoreGuiEnabled("All", false);
                StarterGui.SetCore("ResetButtonCallback", false);
                success = true;
            } catch {
                task.wait(0.5);
            }
        }
    });
}

export function Init() {
    LogService.Info("[Rankgun] Initialising client UI");

    const portal = createPortal(<CentreGui />, playerGui);
    root.render(<StrictMode>{portal}</StrictMode>);

    DisableGui();
    BannerNotify.InitClient();
}
