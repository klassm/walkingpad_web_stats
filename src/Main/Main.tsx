import { Box, Skeleton, Stack, Toolbar, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { type FC, useState } from "react";
import { useData } from "../fetchData.js";
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
