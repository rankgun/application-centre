import { Players, DataStoreService } from "@rbxts/services";
import BannerNotify from "@rbxts/banner-notify";

import { remotes } from "shared/remotes";
import { Application, RankgunInitConfig } from "shared/types";

import { getApplication, getApplicationList, setRank, setVerbose } from "./rankgunApi";

const CooldownDatastore = DataStoreService.GetDataStore("rankgun-application-cooldown");

function notifyError(player: Player, header: string, message: string) {
    BannerNotify.Notify({
        player, header, message,
        icon: "rbxassetid://18576886056",
        duration: 3,
        configs: [ 0.3, Color3.fromHex("#500202"), 0, Color3.fromHex("#FFFFFF") ]
    });
}

function addClientLoader(player: Player) {
    const clientLoader = script.FindFirstChild("clientLoader")?.Clone();
    if (clientLoader) clientLoader.Parent = player.FindFirstChild("PlayerGui");
}

const applicationCache: { [applicationId: string]: Application } = {};

export function Init({ workspaceId, apiToken, verbose = false }: RankgunInitConfig) {
    setVerbose(verbose);
    print("[Rankgun] Initialising remote listeners");

    BannerNotify.InitServer();

    // set up remote listeners
    remotes.getCentreData.onRequest((player) => { 
        const applications = getApplicationList(apiToken);

        if (applications.forms) {
            // only return applications that are active.
            return applications.forms?.filter((application) => application.isActive );
        } else {
            notifyError(player, "Couldn't load applications", "The centre failed to load applications. Try again later")
            return [];
        }
    });

    remotes.getApplicationQuestions.onRequest((player, applicationId) => {
        const application = getApplication(apiToken, applicationId);

        if (application.form && application.form.questions) {
            applicationCache[applicationId] = application.form;

            // check if the user has recently attempted this application
            const [lastSubmission, _] = CooldownDatastore.GetAsync<number>(`${applicationId}-${player.UserId}`);
            const currentTime = os.time();

            if (lastSubmission && ((lastSubmission + (application.form.cooldownHours * 60 * 60)) > currentTime)) {
                notifyError(player, "Already attempted", `You've tried this too recently. Wait ${application.form.cooldownHours} hours.`)
                return [];
            }

            const random = new Random();

            const questions = application.form.questions.map((question) => {
                // collate and shuffle the answers before sending to the client
                const answers = [ ...question.incorrectAnswers, question.correctAnswer ];
                random.Shuffle(answers);

                return { 
                    id: question.id,
                    order: question.order,
                    questionText: question.questionText,
                    questionType: question.questionType,
                    // points: question.points,
                    isRequired: question.isRequired,
                    answers
                }
            });

            return questions;
        } else {
            notifyError(player, "Couldn't load application list", "Rankgun couldn't fetch a list of applications.")
            return [];
        }
    });

    remotes.markApplication.onRequest((player, markingRequest) => {
        const { applicationId, answers } = markingRequest;

        // get the application's details, either from cache or the API
        const application = (applicationCache[applicationId]) ?
            applicationCache[applicationId] :
            getApplication(apiToken, applicationId).form;
            
        // set time the application was most recently completed
        CooldownDatastore.SetAsync(`${applicationId}-${player.UserId}`, os.time());

        if (application) {
            let correctAnswers = 0;
            
            // iterate over each question, finding correct answers
            for (const question of application.questions) {
                const answer = answers.find((a) => a.questionId === question.id);
                if (answer && answer.selectedAnswer === question.correctAnswer) {
                    correctAnswers++;
                }
            }

            const score = (correctAnswers / application.questions.size());
            const hasPassed = score >= (application.passPercentage / 100);

            // rank the user only if they have passed
            if (hasPassed) {
                const rankResponse = setRank(player, application.targetRankId, workspaceId, apiToken);
                if (!rankResponse || rankResponse.StatusCode !== 200) {
                    warn("[Rankgun] Failed to rank eligible user");
                    if (rankResponse.Body) warn(rankResponse.Body);
                    
                    return { passed: false, score, rankName: application.targetRankName, errorMessage: "You passed, but Rankgun couldn't give you the target rank." };
                }
            }

            return { passed: hasPassed, score, rankName: application.targetRankName };
        } else {
            return { passed: false, score: 0, rankName: "", errorMessage: "The centre failed to load the application's questions." };
        }
    });

    // add the client loader to players when they join
    for (const player of Players.GetPlayers()) addClientLoader(player);
    Players.PlayerAdded.Connect(addClientLoader);
}