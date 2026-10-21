import { Box, styled, Typography } from "@mui/material";

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: 13,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: theme.palette.text.secondary,
	marginBottom: theme.spacing(1.5),
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
	"&::before": {
		content: '""',
		display: "block",
		width: 8,
		height: 8,
		borderRadius: "50%",
		backgroundColor: theme.palette.primary.main,
	},
}));

export const GroupContainer = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(4),
	marginTop: theme.spacing(1),
	scrollMarginTop: 96,
}));
