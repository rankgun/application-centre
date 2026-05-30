import { HttpService } from "@rbxts/services";
import { ApplicationResponse, ApplicationsResults } from "shared/types";

const BASE_URL = "https://api.rankgun.works";

let verbose = false;

export function setVerbose(value: boolean) {
    verbose = value;
}

function httpRequest(path: string, apiToken: string, method: "GET" | "POST", body?: string): { Body: object, StatusCode: number } {
    if (verbose) print(`[Rankgun] → ${method} ${path}${body ? ` ${body}` : ""}`);

    const request = HttpService.RequestAsync({
        Url: `${BASE_URL}${path}`,
        Method: method,
        Headers: {
            "x-api-key": apiToken
        },
        ...(body ? { Body: body } : {}),
    });

    if (request.Body) {
        const decodedBody = HttpService.JSONDecode(request.Body) as object;
        if (verbose) print(`[Rankgun] ← ${request.StatusCode} ${HttpService.JSONEncode(decodedBody)}`);
        return {
            Body: decodedBody,
            StatusCode: request.StatusCode
        }
    } else {
        if (verbose) warn(`[Rankgun] ← ${request.StatusCode} (empty body)`);
        return {
            Body: { success: false, error: "Failed to fetch from Rankgun API", code: "API_FAILED" },
            StatusCode: 500
        }
    }
}

export function getApplicationList(apiToken: string): ApplicationsResults {
    const apiResponse = httpRequest(`/api/applications`, apiToken, "GET");
    return apiResponse.Body as ApplicationsResults;
}

export function getApplication(apiToken: string, applicationId: string): ApplicationResponse {
    const apiResponse = httpRequest(`/api/applications/forms/${applicationId}`, apiToken, "GET");
    return apiResponse.Body as ApplicationResponse;
}

export function setRank(player: Player, rank: number, workspaceId: string, apiToken: string) {
    const apiResponse = httpRequest(
        "/api/roblox/setrank", apiToken, "POST",
        HttpService.JSONEncode({
            rankId: rank,
            userId: player.UserId,
            workspaceId: workspaceId,
        }),
    );
    return apiResponse;
}
