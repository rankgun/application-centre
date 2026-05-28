import { type Server, createRemotes, loggerMiddleware, remote } from "@rbxts/remo";
import { t } from "@rbxts/t";

import { 
	type ApplicationDetails, type ClientApplicationQuestion, type MarkingRequest, type MarkingResult,
 	tApplicationDetails, tClientApplicationQuestion, tMarkingRequest, tMarkingResult
} from "./types";

export const remotes = createRemotes(
	{
		getCentreData: remote<Server>()
			.returns<ApplicationDetails[]>(t.array(tApplicationDetails)),

		getApplicationQuestions: remote<Server, [application: string]>(t.string)
			.returns<ClientApplicationQuestion[]>(t.array(tClientApplicationQuestion)),

		markApplication: remote<Server, [answers: MarkingRequest]>(tMarkingRequest)
			.returns<MarkingResult>(tMarkingResult)
	},
	loggerMiddleware,
);