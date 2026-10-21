import { IconButton, Stack, Tooltip } from "@mui/material";
import type { FC } from "react";
import { useColorMode } from "./ColorModeContext.js";

interface IconProps {
	color: string;
}

const SunIcon: FC<IconProps> = ({ color }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		focusable="false"
	>
		<title>Light mode</title>
		<circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.8" />
		<path
			d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19"
			stroke={color}
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

const MonitorIcon: FC<IconProps> = ({ color }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		focusable="false"
	>
		<title>Follow system</title>
		<rect
			x="3"
			y="4.5"
			width="18"
			height="12.5"
			rx="1.8"
			stroke={color}
			strokeWidth="1.8"
		/>
		<path
			d="M9 20.5h6M12 17.5v3"
			stroke={color}
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

const MoonIcon: FC<IconProps> = ({ color }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden
		focusable="false"
	>
		<title>Dark mode</title>
		<path
			d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
			stroke={color}
			strokeWidth="1.8"
			strokeLinejoin="round"
		/>
	</svg>
);

interface OptionProps {
	active: boolean;
	title: string;
	onClick: () => void;
	children: React.ReactNode;
}

const Option: FC<OptionProps> = ({ active, title, onClick, children }) => (
	<Tooltip title={title}>
		<IconButton
			size="small"
			aria-label={title}
			aria-pressed={active}
			onClick={onClick}
			sx={(theme) => ({
				borderRadius: 2,
				p: 0.75,
				color: active
					? theme.palette.primary.main
					: theme.palette.text.secondary,
				backgroundColor: active
					? `${theme.palette.primary.main}1f`
					: "transparent",
				"&:hover": {
					backgroundColor: active
						? `${theme.palette.primary.main}2e`
						: theme.palette.action.hover,
				},
			})}
		>
			{children}
		</IconButton>
	</Tooltip>
);

export const ModeToggle: FC = () => {
	const { preference, setPreference } = useColorMode();

	return (
		<Stack
			direction="row"
			spacing={0.5}
			sx={{ mr: 1, p: 0.5, borderRadius: 2.5, bgcolor: "action.hover" }}
		>
			<Option
				active={preference === "light"}
				title="Light mode"
				onClick={() => setPreference("light")}
			>
				<SunIcon color="currentColor" />
			</Option>
			<Option
				active={preference === "system"}
				title="Follow system"
				onClick={() => setPreference("system")}
			>
				<MonitorIcon color="currentColor" />
			</Option>
			<Option
				active={preference === "dark"}
				title="Dark mode"
				onClick={() => setPreference("dark")}
			>
				<MoonIcon color="currentColor" />
			</Option>
		</Stack>
	);
};
