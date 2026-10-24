import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useSyncExternalStore } from "react";
import { knownConnectionStates } from "../fetchData.js";
import {
	type TreadmillLiveState,
	type TreadmillSocketStatus,
	treadmillSocket,
} from "./treadmillSocket.js";

/** Starts the socket lazily and mirrors its status into render. */
export function useTreadmillSocketStatus(): TreadmillSocketStatus {
	useEffect(() => treadmillSocket.start(), []);
	return useSyncExternalStore(
		(onStoreChange) => treadmillSocket.subscribeStatus(onStoreChange),
		() => treadmillSocket.getStatus(),
	);
}

/** Latest `treadmill` push from the macOS client, or null before the first one. */
export function useLiveTreadmill(): TreadmillLiveState | null {
	useEffect(() => treadmillSocket.start(), []);
	return useSyncExternalStore(
		(onStoreChange) => treadmillSocket.subscribeTreadmill(onStoreChange),
		() => treadmillSocket.getLatestTreadmill(),
	);
}

/**
 * Bridges socket events into the React Query cache: `connection` events keep
 * the status chip real-time and `workout` saves refetch the history so today's
 * numbers stay current. The HTTP polling in `useConnectionState`/`useData`
 * remains as the degraded-mode fallback while the socket is offline.
 */
export function useTreadmillEventBridge(): void {
	const queryClient = useQueryClient();
	useEffect(() => treadmillSocket.start(), []);
	useEffect(() => {
		const unsubscribeConnection = treadmillSocket.subscribeConnection(
			(state) => {
				// Apply the same whitelist the HTTP path uses so an unexpected
				// state string can never enter the cache unvalidated.
				if (knownConnectionStates.includes(state)) {
					queryClient.setQueryData(["treadmill-connection"], state);
				}
			},
		);
		const unsubscribeWorkout = treadmillSocket.subscribeWorkout(() => {
			// invalidateQueries (not refetchQueries) so React Query dedupes
			// against the standing 60 s poll instead of stacking a second fetch.
			queryClient.invalidateQueries({ queryKey: ["treadmill-data"] });
		});
		return () => {
			unsubscribeConnection();
			unsubscribeWorkout();
		};
	}, [queryClient]);
}
