import { HttpService, Players, RunService } from "@rbxts/services";

import { CENTRE_VERSION } from "../version";

/**
 * Lightweight, fire-and-forget operational telemetry for the application centre.
 *
 * Because centres are self-hosted, RankGun otherwise has no remote visibility
 * into whether a centre is running, on what build, or where it's failing. This
 * module reports aggregate operational events to RankGun's `/api/telemetry`
 * endpoint using the same `x-api-key` the centre already holds.
 *
 * It never sends end-user PII — no UserIds, usernames, question text, answers,
 * or raw error bodies. Only instance-level facts and short status/error codes.
 * All network calls are wrapped in `pcall` and dispatched on a separate thread,
 * so telemetry can never block or break gameplay.
 */

const BASE_URL = "https://api.rankgun.works";
const CENTRE_TYPE = "application";
const FLUSH_INTERVAL = 30; // seconds between batched flushes
const HEARTBEAT_INTERVAL = 120; // seconds between liveness heartbeats
const MAX_QUEUE = 20; // flush early once this many events are queued

export type TelemetryProps = {
	applicationId?: string;
	passed?: boolean;
	score?: number;
	targetRankId?: number;
	success?: boolean;
	httpStatus?: number;
	call?: string;
	code?: string;
	formCount?: number;
};

type QueuedEvent = { type: string; t: number; props?: TelemetryProps };

let apiToken = "";
let started = false;
let startClock = 0;
let queue: QueuedEvent[] = [];

function environment(): "live" | "studio" {
	return RunService.IsStudio() ? "studio" : "live";
}

/** Build the current envelope and send any queued events on a separate thread. */
function flush() {
	if (queue.size() === 0) {
		return;
	}

	const events = queue;
	queue = [];

	const payload = {
		centreType: CENTRE_TYPE,
		centreVersion: CENTRE_VERSION,
		placeId: game.PlaceId,
		universeId: game.GameId,
		jobId: game.JobId,
		environment: environment(),
		playerCount: Players.GetPlayers().size(),
		uptimeSec: math.floor(os.clock() - startClock),
		events,
	};

	task.spawn(() => {
		pcall(() => {
			HttpService.RequestAsync({
				Url: `${BASE_URL}/api/telemetry`,
				Method: "POST",
				Headers: {
					"Content-Type": "application/json",
					"x-api-key": apiToken,
				},
				Body: HttpService.JSONEncode(payload),
			});
		});
	});
}

/** Queue an event; flushes early once the queue is full. */
function track(eventType: string, props?: TelemetryProps) {
	if (!started) {
		return;
	}

	queue.push({ type: eventType, t: os.time(), props });

	if (queue.size() >= MAX_QUEUE) {
		flush();
	}
}

/** Start telemetry: emit a boot event and run the flush + heartbeat loops. */
function init(config: { workspaceId: string; apiToken: string }) {
	if (started) {
		return;
	}

	apiToken = config.apiToken;
	startClock = os.clock();
	started = true;

	track("centre_boot");
	flush();

	task.spawn(() => {
		while (true) {
			task.wait(FLUSH_INTERVAL);
			flush();
		}
	});

	task.spawn(() => {
		while (true) {
			task.wait(HEARTBEAT_INTERVAL);
			track("heartbeat");
			flush();
		}
	});
}

export const Telemetry = { init, track };
