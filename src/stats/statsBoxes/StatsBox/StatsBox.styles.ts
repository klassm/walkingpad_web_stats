import { Card, styled, Typography } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
	flex: 1,
	minWidth: 180,
	borderRadius: 16,
	border: `1px solid ${theme.palette.divider}`,
	boxShadow: "none",
	transition:
		"box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
	"&:hover": {
		borderColor: `${theme.palette.primary.main}55`,
		boxShadow: theme.shadows[4],
	},
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: theme.palette.primary.main,
	marginBottom: theme.spacing(0.5),
}));

export const StyledDate = styled(Typography)(({ theme }) => ({
	fontSize: 14,
	color: theme.palette.text.secondary,
}));

export const StyledEntry = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.primary,
	fontSize: 15,
	lineHeight: 1.6,
}));
