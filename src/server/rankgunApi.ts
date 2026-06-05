import { HttpService } from "@rbxts/services";
import { ApplicationResponse, ApplicationsResults } from "shared/types";

import { Telemetry } from "./telemetry";

const BASE_URL = "https://api.rankgun.works";

/** Report a non-200 response as an api_error event (status + short code only). */
function reportError(call: string, statusCode: number, body: object) {
    if (statusCode === 200) {
        return;
    }
    Telemetry.track("api_error", {
        call,
        httpStatus: statusCode,
        code: (body as { code?: string }).code,
    });
}

function httpRequest(path: string, apiToken: string, method: "GET" | "POST", body?: string): { Body: object, StatusCode: number } {
    const request = HttpService.RequestAsync({
        Url: `${BASE_URL}${path}`,
        Method: method,
        Headers: {
            "x-api-key": apiToken
        },
        ...(body ? { Body: body } : {}),
    });

    if (request.Body) {
        return {
            Body: HttpService.JSONDecode(request.Body) as object,
            StatusCode: request.StatusCode
        }
    } else {
        return {
            Body: { success: false, error: "Failed to fetch from Rankgun API", code: "API_FAILED" },
            StatusCode: 500
        }
    }
}

export function getApplicationList(apiToken: string): ApplicationsResults {
    const apiResponse = httpRequest(`/api/applications`, apiToken, "GET");
    reportError("list", apiResponse.StatusCode, apiResponse.Body);
    return apiResponse.Body as ApplicationsResults;
}

export function getApplication(apiToken: string, applicationId: string): ApplicationResponse {
    const apiResponse = httpRequest(`/api/applications/forms/${applicationId}`, apiToken, "GET");
    reportError("get", apiResponse.StatusCode, apiResponse.Body);
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
    reportError("setrank", apiResponse.StatusCode, apiResponse.Body);
    return apiResponse;
}
