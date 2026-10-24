import { Paper, type SxProps, type Theme, useTheme } from "@mui/material";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

interface Props {
	sx?: SxProps<Theme>;
	height?: number;
}

const ResponsiveContainerFull: FC<PropsWithChildren> = ({ children }) => (
	<ResponsiveContainer width="100%" height="100%">
		{children as ReactNode}
	</ResponsiveContainer>
);

export const ChartPaper: FC<PropsWithChildren<Props>> = ({
	children,
	sx,
	height = 280,
}) => (
	<Paper
		variant="outlined"
		sx={{ borderRadius: 3, p: 2.5, pt: 3, boxShadow: "none", ...sx }}
	>
		<div style={{ height }}>
			<ResponsiveContainerFull>{children}</ResponsiveContainerFull>
		</div>
	</Paper>
);

export function useChartTheme() {
	const theme = useTheme();
	return {
		gridStroke: theme.palette.divider,
		axisTick: { fontSize: 12, fill: theme.palette.text.secondary },
		tooltipStyle: {
			backgroundColor: theme.palette.background.paper,
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: 8,
			fontSize: 13,
			color: theme.palette.text.primary,
		},
		legendStyle: { fontSize: 13 },
	};
}
