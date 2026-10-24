import {
	Box,
	Button,
	Chip,
	Container,
	IconButton,
	Paper,
	Popover,
	Skeleton,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { type FC, useState } from "react";
import {
	type ConnectionState,
	useConnectionState,
	useData,
} from "../fetchData.js";
import { DashboardToc } from "../layout/DashboardToc.js";
import { sectionGroups } from "../layout/sections.js";
import { TreadmillControlPanel } from "../live/TreadmillControlPanel.js";
import { MonthPicker } from "../MonthPicker/MonthPicker.js";
import { StatsContent } from "../stats/StatsContent/StatsContent.js";
import { ModeToggle } from "../theme/ModeToggle.js";
import {
	useLiveTreadmill,
	useTreadmillEventBridge,
} from "../ws/useTreadmillLive.js";
import { Content, HeaderBar, LogoMark } from "./Main.styles.js";

const TocSkeleton: FC = () => (
	<Box
		sx={{
			display: { xs: "none", md: "block" },
			width: 210,
			flexShrink: 0,
		}}
	>
		{sectionGroups.map((group) => (
			<Box key={group.title} sx={{ mb: 2.5 }}>
				<Skeleton variant="text" width={72} sx={{ mb: 1 }} />
				{group.sections.map((section) => (
					<Skeleton
						key={section.id}
						variant="text"
						sx={{
							borderLeft: 2,
							borderColor: "transparent",
							pl: 1.5,
							py: 0.5,
						}}
					/>
				))}
			</Box>
		))}
	</Box>
);

const LoadingState: FC = () => (
	<Content maxWidth="lg">
		<Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
			<TocSkeleton />
			<Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
				<Box sx={{ display: "flex", gap: 2 }}>
					{[0, 1, 2].map((index) => (
						<Skeleton
							key={index}
							variant="rounded"
							height={140}
							sx={{ flex: 1, borderRadius: 3 }}
						/>
					))}
				</Box>
				<Box sx={{ display: "flex", gap: 2 }}>
					{[0, 1, 2].map((index) => (
						<Skeleton
							key={index}
							variant="rounded"
							height={140}
							sx={{ flex: 1, borderRadius: 3 }}
						/>
					))}
				</Box>
				<Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
				<Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
			</Stack>
		</Box>
	</Content>
);

const ErrorState: FC<{ onRetry: () => void }> = ({ onRetry }) => (
	<Content maxWidth="lg" className="wpac-fade-in">
		<Paper
			variant="outlined"
			sx={{ p: 6, borderRadius: 3, textAlign: "center" }}
		>
			<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
				Couldn't load your workout data
			</Typography>
			<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
				No connection to the WalkingPad client. Is the client app running?
			</Typography>
			<Button variant="contained" onClick={onRetry}>
				Try again
			</Button>
		</Paper>
	</Content>
);

const connectionLabels: Record<ConnectionState, string | null> = {
	disconnected: "Disconnected",
	idle: "Idle",
	running: "Running",
	unknown: null,
};

const MenuIcon: FC = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		focusable="false"
	>
		<path
			d="M4 7h16M4 12h16M4 17h16"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const connectionDotColors: Record<ConnectionState, string> = {
	disconnected: "error.main",
	idle: "text.disabled",
	running: "success.main",
	unknown: "text.disabled",
};

const TreadmillStatusChip: FC = () => {
	const { data: state = "unknown" } = useConnectionState();
	const live = useLiveTreadmill();
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	const label = connectionLabels[state];
	// Reserve the chip's slot so the header never reflows while the
	// connection request is still resolving.
	if (!label) {
		return <Box sx={{ mr: 2, width: 110, height: 40 }} aria-hidden />;
	}
	const speedSuffix =
		state === "running" && live && live.speed > 0
			? ` · ${live.speed.toFixed(1)} km/h`
			: "";
	return (
		<>
			<Chip
				label={
					<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
						<Box
							component="span"
							sx={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								bgcolor: connectionDotColors[state],
								transition: "background-color 150ms ease",
							}}
						/>
						{/* The live speed suffix only fits from sm up. */}
						{label}
						<Box
							component="span"
							sx={{ display: { xs: "none", sm: "inline" } }}
						>
							{speedSuffix}
						</Box>
					</Stack>
				}
				size="small"
				variant="outlined"
				clickable
				onClick={(event) => setAnchor(event.currentTarget)}
				aria-label={`Treadmill ${label} — open controls`}
				title={`Treadmill ${label}`}
				sx={{
					// On phones the chip is the last header item — no extra right
					// margin, so its right edge aligns with the cards below.
					mr: { xs: 0, sm: 2 },
					height: 40,
					minWidth: { xs: 56, sm: 110 },
					justifyContent: "center",
					borderRadius: 2,
					bgcolor: "action.hover",
					borderColor: "transparent",
					color: "text.secondary",
					fontSize: 14,
					fontWeight: 600,
					cursor: "pointer",
				}}
			/>
			<Popover
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={() => setAnchor(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				slotProps={{
					paper: { sx: { p: 2.5, width: 320, borderRadius: 3, mt: 1 } },
				}}
			>
				<TreadmillControlPanel />
			</Popover>
		</>
	);
};

const MonthPickerSlot: FC<{
	month: DateTime<true>;
	min: DateTime;
	onChange: (date: DateTime<true>) => void;
	ready: boolean;
}> = ({ month, min, onChange, ready }) => (
	<Box
		data-testid="month-picker-slot"
		sx={{
			width: { xs: 44, sm: 130 },
			flexShrink: 0,
			ml: 1,
			// Phones get the month selector in the navigation drawer instead.
			display: { xs: "none", sm: "block" },
		}}
	>
		{ready ? (
			<MonthPicker value={month} min={min} onChange={onChange} />
		) : (
			<Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
		)}
	</Box>
);

export const Main: FC = () => {
	const { isLoading, data, isError, refetch } = useData();
	const [month, setMonth] = useState(DateTime.local());
	const [navOpen, setNavOpen] = useState(false);
	useTreadmillEventBridge();

	const showError = isError && !data;
	const showLoading = isLoading || !data;

	return (
		<>
			<HeaderBar position="sticky" elevation={0}>
				<Container maxWidth="lg">
					<Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
						<IconButton
							aria-label="Open navigation"
							onClick={() => setNavOpen(true)}
							sx={{
								display: { xs: "inline-flex", md: "none" },
								mr: 1,
								color: "text.secondary",
							}}
						>
							<MenuIcon />
						</IconButton>
						<LogoMark
							src="/favicon-64.png"
							alt=""
							sx={{ display: { xs: "none", sm: "block" } }}
						/>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{
								fontWeight: 700,
								letterSpacing: 0.2,
								flexGrow: 1,
								fontSize: { xs: 17, sm: undefined },
							}}
						>
							WalkingPad
						</Typography>
						<TreadmillStatusChip />
						<Box sx={{ display: { xs: "none", sm: "block" } }}>
							<ModeToggle />
						</Box>
						{/* The picker slot always occupies its space so the header
						    is layout-stable from the first paint. */}
						<MonthPickerSlot
							month={month}
							min={data?.[0]?.date ?? DateTime.local()}
							onChange={setMonth}
							ready={Boolean(data)}
						/>
					</Toolbar>
				</Container>
			</HeaderBar>

			{showError ? (
				<ErrorState onRetry={() => refetch()} />
			) : showLoading ? (
				<LoadingState />
			) : (
				data && (
					<Content maxWidth="lg" className="wpac-fade-in">
						<Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
							<DashboardToc
								mobileOpen={navOpen}
								onMobileClose={() => setNavOpen(false)}
								monthPicker={
									<MonthPicker
										value={month}
										min={data?.[0]?.date ?? DateTime.local()}
										onChange={setMonth}
									/>
								}
							/>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<StatsContent data={data} month={month} />
							</Box>
						</Box>
					</Content>
				)
			)}
		</>
	);
};
