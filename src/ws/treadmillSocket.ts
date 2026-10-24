// WebSocket channel to the WalkingPad macOS client (ws://127.0.0.1:4935/ws).
// Pushes live treadmill state (≈5 s cadence), workout saves and connection
// changes; commands are sent with an id and resolved by the matching ack.
// When the socket is unavailable, the dashboard degrades gracefully to the
// existing HTTP polling hooks.

export interface TreadmillLiveState {
	speed: number;
	steps: number;
	distance: number;
	walkingSeconds: number;
	walkingMode: "manual" | "automatic";
}

export type TreadmillSocketStatus = "connecting" | "online" | "offline";

const WS_URL = "ws://127.0.0.1:4935/ws";
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
const COMMAND_TIMEOUT_MS = 5_000;

type StatusListener = (status: TreadmillSocketStatus) => void;
type TreadmillListener = (state: TreadmillLiveState | null) => void;
type ConnectionListener = (state: string) => void;

interface PendingCommand {
	resolve: () => void;
	reject: (error: Error) => void;
	timer: ReturnType<typeof setTimeout>;
}

function parseTreadmillState(
	message: Record<string, unknown>,
): TreadmillLiveState | null {
	const { speed, steps, distance, walkingSeconds, walkingMode } = message;
	if (
		typeof speed !== "number" ||
		typeof steps !== "number" ||
		typeof distance !== "number" ||
		typeof walkingSeconds !== "number" ||
		(walkingMode !== "manual" && walkingMode !== "automatic")
	) {
		return null;
	}
	return { speed, steps, distance, walkingSeconds, walkingMode };
}

class TreadmillSocket {
	private socket: WebSocket | null = null;
	private attempts = 0;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private status: TreadmillSocketStatus = "connecting";
	private latestTreadmill: TreadmillLiveState | null = null;
	private nextCommandId = 1;
	private pending = new Map<number, PendingCommand>();
	private statusListeners = new Set<StatusListener>();
	private treadmillListeners = new Set<TreadmillListener>();
	private connectionListeners = new Set<ConnectionListener>();
	private workoutListeners = new Set<() => void>();
	private started = false;

	start(): void {
		if (this.started || typeof WebSocket === "undefined") {
			return;
		}
		this.started = true;
		this.connect();
	}

	getStatus(): TreadmillSocketStatus {
		return this.status;
	}

	getLatestTreadmill(): TreadmillLiveState | null {
		return this.latestTreadmill;
	}

	/**
	 * Optimistic UI: patch the displayed belt speed right after a command
	 * ack instead of waiting up to ~5 s for the next treadmill push. The
	 * next push reconciles with server truth.
	 */
	applySpeed(speed: number): void {
		if (!this.latestTreadmill) {
			return;
		}
		const clamped = Math.min(8, Math.max(0, speed));
		this.latestTreadmill = { ...this.latestTreadmill, speed: clamped };
		this.emit(this.treadmillListeners, this.latestTreadmill);
	}

	subscribeStatus(listener: StatusListener): () => void {
		return this.subscribe(this.statusListeners, listener);
	}

	subscribeTreadmill(listener: TreadmillListener): () => void {
		return this.subscribe(this.treadmillListeners, listener);
	}

	subscribeConnection(listener: ConnectionListener): () => void {
		return this.subscribe(this.connectionListeners, listener);
	}

	subscribeWorkout(listener: () => void): () => void {
		return this.subscribe(this.workoutListeners, listener);
	}

	private subscribe<T>(set: Set<T>, listener: T): () => void {
		set.add(listener);
		return () => {
			set.delete(listener);
		};
	}

	private emit<T>(set: Set<(arg: T) => void>, arg: T): void {
		for (const listener of set) {
			listener(arg);
		}
	}

	sendCommand(type: string, payload?: Record<string, unknown>): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
				reject(new Error("not-connected"));
				return;
			}
			const id = this.nextCommandId++;
			const timer = setTimeout(() => {
				this.pending.delete(id);
				reject(new Error("timeout"));
			}, COMMAND_TIMEOUT_MS);
			this.pending.set(id, { resolve, reject, timer });
			this.socket.send(JSON.stringify({ id, type, ...payload }));
		});
	}

	private setStatus(status: TreadmillSocketStatus): void {
		if (this.status === status) {
			return;
		}
		this.status = status;
		this.emit(this.statusListeners, status);
	}

	private connect(): void {
		this.setStatus("connecting");
		let socket: WebSocket;
		try {
			socket = new WebSocket(WS_URL);
		} catch {
			this.scheduleReconnect();
			return;
		}
		this.socket = socket;
		socket.onopen = () => {
			this.attempts = 0;
			this.setStatus("online");
			// Live state from a previous connection (or a restarted macOS app)
			// is stale — clear it so tiles blank out honestly until the next
			// `treadmill` push instead of showing minutes-old values.
			this.latestTreadmill = null;
			this.emit(this.treadmillListeners, null);
		};
		socket.onmessage = (event) => {
			this.handleMessage(event.data);
		};
		// onerror is always followed by onclose, which owns the reconnect.
		socket.onerror = () => {
			socket.close();
		};
		socket.onclose = () => {
			this.failPending("connection-closed");
			if (this.socket === socket) {
				this.socket = null;
				this.scheduleReconnect();
			}
		};
	}

	private handleMessage(raw: unknown): void {
		let parsed: unknown;
		try {
			parsed = JSON.parse(String(raw));
		} catch {
			return;
		}
		if (!parsed || typeof parsed !== "object") {
			return;
		}
		const message = parsed as Record<string, unknown>;
		switch (message.type) {
			case "treadmill": {
				const state = parseTreadmillState(message);
				if (state) {
					this.latestTreadmill = state;
					this.emit(this.treadmillListeners, state);
				}
				break;
			}
			case "connection": {
				if (typeof message.state === "string") {
					this.emit(this.connectionListeners, message.state);
				}
				break;
			}
			case "workout": {
				for (const listener of this.workoutListeners) {
					listener();
				}
				break;
			}
			case "ack": {
				const pending = this.takePending(message.id);
				pending?.resolve();
				break;
			}
			case "error": {
				const pending = this.takePending(message.id);
				pending?.reject(new Error(String(message.code ?? "unknown")));
				break;
			}
			default:
				break;
		}
	}

	private takePending(id: unknown): PendingCommand | undefined {
		if (typeof id !== "number") {
			return undefined;
		}
		const pending = this.pending.get(id);
		if (pending) {
			clearTimeout(pending.timer);
			this.pending.delete(id);
		}
		return pending;
	}

	private failPending(reason: string): void {
		for (const [id, pending] of this.pending) {
			clearTimeout(pending.timer);
			pending.reject(new Error(reason));
			this.pending.delete(id);
		}
	}

	private scheduleReconnect(): void {
		this.setStatus("offline");
		if (this.reconnectTimer) {
			return;
		}
		const delay = Math.min(
			RECONNECT_BASE_MS * 2 ** this.attempts,
			RECONNECT_MAX_MS,
		);
		this.attempts++;
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect();
		}, delay);
	}
}

export const treadmillSocket = new TreadmillSocket();
