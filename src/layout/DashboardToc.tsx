import {
	Box,
	Drawer,
	List,
	ListSubheader,
	Stack,
	Typography,
} from "@mui/material";
import { type FC, type ReactNode, useEffect, useState } from "react";
import { ModeToggle } from "../theme/ModeToggle.js";
import { allSections, sectionGroups } from "./sections.js";

function scrollToSection(id: string) {
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function useActiveSection(): string {
	const [active, setActive] = useState(allSections[0].id);

	useEffect(() => {
		let frame = 0;

		const compute = () => {
			frame = 0;
			let current = allSections[0].id;
			for (const section of allSections) {
				const element = document.getElementById(section.id);
				if (element && element.getBoundingClientRect().top <= 120) {
					current = section.id;
				}
			}
			const atBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2;
			if (atBottom) {
				current = allSections[allSections.length - 1].id;
			}
			setActive((previous) => (previous === current ? previous : current));
		};

		const schedule = () => {
			if (!frame) {
				frame = window.requestAnimationFrame(compute);
			}
		};

		compute();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			if (frame) {
				window.cancelAnimationFrame(frame);
			}
		};
	}, []);

	return active;
}

const DesktopToc: FC<{ active: string }> = ({ active }) => (
	<Box
		sx={{
			display: { xs: "none", md: "block" },
			width: 210,
			flexShrink: 0,
			position: "sticky",
			top: 96,
			alignSelf: "flex-start",
		}}
	>
		{sectionGroups.map((group) => (
			<Box key={group.title} sx={{ mb: 2.5 }}>
				<Typography
					variant="caption"
					sx={{
						color: "text.secondary",
						fontWeight: 700,
						letterSpacing: "0.08em",
						textTransform: "uppercase",
						display: "block",
						mb: 1,
					}}
				>
					{group.title}
				</Typography>
				{group.sections.map((section) => (
					<Typography
						key={section.id}
						component="button"
						onClick={() => scrollToSection(section.id)}
						aria-current={active === section.id ? "true" : undefined}
						sx={{
							display: "block",
							width: "100%",
							textAlign: "left",
							bgcolor: "transparent",
							border: "none",
							borderLeft: 2,
							borderColor: (_theme) =>
								active === section.id ? "primary.main" : "transparent",
							color: (_theme) =>
								active === section.id ? "primary.main" : "text.secondary",
							fontWeight: active === section.id ? 600 : 400,
							fontSize: 13.5,
							py: 0.5,
							pl: 1.5,
							cursor: "pointer",
							transition: "border-color 150ms ease, color 150ms ease",
							"&:hover": {
								color: "text.primary",
							},
							"&.Mui-focusVisible": {
								outline: "2px solid",
								outlineColor: "primary.main",
								outlineOffset: "-2px",
							},
						}}
					>
						{section.label}
					</Typography>
				))}
			</Box>
		))}
	</Box>
);

const MobileToc: FC<{
	open: boolean;
	onClose: () => void;
	active: string;
	monthPicker?: ReactNode;
}> = ({ open, onClose, active, monthPicker }) => (
	<Drawer
		anchor="left"
		open={open}
		onClose={onClose}
		slotProps={{
			paper: {
				sx: {
					width: 260,
					pt: 2,
					display: "flex",
					flexDirection: "column",
				},
			},
		}}
	>
		<Box
			sx={{
				flex: 1,
				overflowY: "auto",
			}}
		>
			<List component="nav" disablePadding>
				{sectionGroups.map((group) => (
					<Box key={group.title} sx={{ mb: 1.5 }}>
						<ListSubheader
							disableSticky
							sx={{
								bgcolor: "transparent",
								color: "text.secondary",
								fontWeight: 700,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								fontSize: 12,
								lineHeight: 2,
							}}
						>
							{group.title}
						</ListSubheader>
						{group.sections.map((section) => (
							<Typography
								key={section.id}
								component="button"
								onClick={() => {
									onClose();
									scrollToSection(section.id);
								}}
								aria-current={active === section.id ? "true" : undefined}
								sx={{
									display: "block",
									width: "100%",
									textAlign: "left",
									bgcolor: "transparent",
									border: "none",
									borderLeft: 2,
									borderColor: (_theme) =>
										active === section.id ? "primary.main" : "transparent",
									color: (_theme) =>
										active === section.id ? "primary.main" : "text.primary",
									fontWeight: active === section.id ? 600 : 400,
									fontSize: 14,
									py: 1,
									pl: 2.5,
									pr: 2,
									cursor: "pointer",
									"&:hover": {
										color: "primary.main",
									},
									"&.Mui-focusVisible": {
										outline: "2px solid",
										outlineColor: "primary.main",
										outlineOffset: "-2px",
									},
								}}
							>
								{section.label}
							</Typography>
						))}
					</Box>
				))}
			</List>
		</Box>
		<Box
			sx={{
				mt: "auto",
				p: 2,
				borderTop: 1,
				borderColor: "divider",
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			{monthPicker && (
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Month
					</Typography>
					{monthPicker}
				</Stack>
			)}
			<Stack
				direction="row"
				sx={{
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					Theme
				</Typography>
				<ModeToggle />
			</Stack>
		</Box>
	</Drawer>
);

export const DashboardToc: FC<{
	mobileOpen: boolean;
	onMobileClose: () => void;
	/** Rendered in the drawer footer on phones (month picker). */
	monthPicker?: ReactNode;
}> = ({ mobileOpen, onMobileClose, monthPicker }) => {
	const active = useActiveSection();
	return (
		<>
			<DesktopToc active={active} />
			<MobileToc
				open={mobileOpen}
				onClose={onMobileClose}
				active={active}
				monthPicker={monthPicker}
			/>
		</>
	);
};
