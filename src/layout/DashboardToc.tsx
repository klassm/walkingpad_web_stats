import { Box, MenuItem, Select, Typography } from "@mui/material";
import { type FC, useEffect, useState } from "react";
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
							transition: "color 0.15s ease",
							"&:hover": {
								color: "text.primary",
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

const MobileToc: FC<{ active: string }> = ({ active }) => (
	<Box
		sx={{
			display: { xs: "block", md: "none" },
			mb: 2,
			position: "sticky",
			top: 72,
			zIndex: 10,
		}}
	>
		<Select
			fullWidth
			size="small"
			value={active}
			onChange={(event) => scrollToSection(event.target.value)}
			sx={{ bgcolor: "background.paper", borderRadius: 2 }}
		>
			{sectionGroups.map((group) => (
				<MenuItem key={group.title} disabled sx={{ opacity: 0.6 }}>
					{group.title}
				</MenuItem>
			))}
			{sectionGroups.flatMap((group) =>
				group.sections.map((section) => (
					<MenuItem key={section.id} value={section.id}>
						{section.label}
					</MenuItem>
				)),
			)}
		</Select>
	</Box>
);

export const DashboardToc: FC = () => {
	const active = useActiveSection();
	return (
		<>
			<DesktopToc active={active} />
			<MobileToc active={active} />
		</>
	);
};
