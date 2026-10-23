import { Box, Chip, Skeleton, Stack, Toolbar, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { type FC, useState } from "react";
import {
	type ConnectionState,
	useConnectionState,
	useData,
} from "../fetchData.js";
import { DashboardToc } from "../layout/DashboardToc.js";
import { MonthPicker } from "../MonthPicker/MonthPicker.js";
import { StatsContent } from "../stats/StatsContent/StatsContent.js";
import { ModeToggle } from "../theme/ModeToggle.js";
import {
	Content,
	HeaderBar,
	HeaderContainer,
	LogoMark,
} from "./Main.styles.js";

const LoadingState: FC = () => (
	<Content maxWidth="lg">
		<Stack spacing={3} sx={{ mt: 4 }}>
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
	</Content>
);

const connectionLabels: Record<ConnectionState, string | null> = {
	disconnected: "Disconnected",
	idle: "Idle",
	running: "Running",
	unknown: null,
};

const connectionDotColors: Record<ConnectionState, string> = {
	disconnected: "error.main",
	idle: "text.disabled",
	running: "success.main",
	unknown: "text.disabled",
};

const TreadmillStatusChip: FC = () => {
	const { data: state = "unknown" } = useConnectionState();
	const label = connectionLabels[state];
	if (!label) {
		return null;
	}
	return (
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
						}}
					/>
					{label}
				</Stack>
			}
			size="small"
			variant="outlined"
			sx={{
				mr: 2,
				height: 34,
				borderRadius: 2.5,
				bgcolor: "action.hover",
				borderColor: "transparent",
				color: "text.secondary",
				fontSize: 14,
				fontWeight: 600,
				"&:hover": { bgcolor: "action.selected" },
			}}
		/>
	);
};

export const Main: FC = () => {
	const { isLoading, data } = useData();
	const [month, setMonth] = useState(DateTime.local());

	return (
		<>
			<HeaderBar position="sticky" elevation={0}>
				<HeaderContainer maxWidth="lg">
					<Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
						<LogoMark src="/favicon-64.png" alt="" />
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{ fontWeight: 700, letterSpacing: 0.2, flexGrow: 1 }}
						>
							WalkingPad Stats
						</Typography>
						<TreadmillStatusChip />
						<ModeToggle />
						{data && (
							<MonthPicker
								value={month}
								min={data[0].date}
								onChange={setMonth}
							/>
						)}
					</Toolbar>
				</HeaderContainer>
			</HeaderBar>

			{isLoading || !data ? (
				<LoadingState />
			) : (
				<Content maxWidth="lg">
					<Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
						<DashboardToc />
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<StatsContent data={data} month={month} />
						</Box>
					</Box>
				</Content>
			)}
		</>
	);
};
