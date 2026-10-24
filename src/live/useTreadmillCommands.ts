import { useMemo, useState } from "react";
import { useConnectionState } from "../fetchData.js";
import { treadmillSocket } from "../ws/treadmillSocket.js";
import {
	useLiveTreadmill,
	useTreadmillSocketStatus,
} from "../ws/useTreadmillLive.js";

// The macOS client accepts 1.0–8.0 km/h at 0.1 km/h granularity over the
// websocket; the preset grid mirrors the native UI in 0.5 km/h steps.
export const SPEED_PRESETS = Array.from(
	{ length: 15 },
	(_, index) => 1 + index * 0.5,
);

export const commandErrorMessages: Record<string, string> = {
	"no-connection": "The treadmill is not connected.",
	"invalid-speed": "Speed must be between 1.0 and 8.0 km/h.",
	"bad-request": "The macOS client did not understand that command.",
	// The ack never arrived — the client may still have queued the command.
	timeout: "No confirmation — the command may still have taken effect.",
};

/**
 * Shared treadmill command surface: live state, availability gating, and
 * command execution with error reporting. Used by both the header popover
 * and the inline live section.
 */
export const useTreadmillCommands = () => {
	const live = useLiveTreadmill();
	const socketStatus = useTreadmillSocketStatus();
	const { data: connection = "unknown" } = useConnectionState();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const treadmillAvailable = connection !== "disconnected";
	const controlsDisabled =
		socketStatus !== "online" || !treadmillAvailable || pending;

	const activePreset = useMemo(() => {
		if (!live || live.speed <= 0) {
			return null;
		}
		// Tight tolerance: the belt can run between presets (0.1 km/h steps),
		// and only an (almost) exact match counts as "this preset is active".
		return SPEED_PRESETS.find((preset) => Math.abs(preset - live.speed) < 0.05);
	}, [live]);

	const run = async (
		type: string,
		payload?: Record<string, unknown>,
	): Promise<void> => {
		setPending(true);
		setError(null);
		try {
			await treadmillSocket.sendCommand(type, payload);
			// Optimistic speed: react to the ack immediately — the next
			// treadmill push (≤5 s) reconciles with the belt's real state.
			if (type === "stop") {
				treadmillSocket.applySpeed(0);
			} else if (type === "faster" && live) {
				treadmillSocket.applySpeed(live.speed + 0.5);
			} else if (type === "slower" && live) {
				treadmillSocket.applySpeed(live.speed - 0.5);
			} else if (type === "setSpeed" && typeof payload?.speedKmh === "number") {
				treadmillSocket.applySpeed(payload.speedKmh);
			}
		} catch (cause) {
			const code = cause instanceof Error ? cause.message : "unknown";
			setError(
				commandErrorMessages[code] ??
					"Command failed — is the macOS client running?",
			);
		} finally {
			setPending(false);
		}
	};

	const setMode = async (mode: "manual" | "automatic"): Promise<void> => {
		if (live && mode === live.walkingMode) {
			return;
		}
		await run("setMode", { walkingMode: mode });
	};

	return {
		live,
		socketStatus,
		connection,
		treadmillAvailable,
		controlsDisabled,
		pending,
		error,
		clearError: () => setError(null),
		run,
		setMode,
		activePreset,
	};
};
