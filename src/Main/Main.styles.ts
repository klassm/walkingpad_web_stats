import { AppBar, Container, styled } from "@mui/material";

export const HeaderBar = styled(AppBar)(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === "light"
			? "rgba(255, 255, 255, 0.85)"
			: "rgba(18, 20, 19, 0.85)",
	backdropFilter: "blur(12px)",
	borderBottom: `1px solid ${theme.palette.divider}`,
	color: theme.palette.text.primary,
}));

export const HeaderContainer = styled(Container)({});

export const LogoMark = styled("img")({
	width: 34,
	height: 34,
	borderRadius: 10,
	objectFit: "cover",
	marginRight: 12,
	flexShrink: 0,
});

export const Content = styled(Container)(({ theme }) => ({
	paddingTop: theme.spacing(3),
	[theme.breakpoints.up("sm")]: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(2),
	},
}));
