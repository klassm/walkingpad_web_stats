import type { FC, PropsWithChildren } from "react";
import { GroupContainer, StyledTitle } from "./StatsGroup.styles.js";

interface StatsGroupProps {
	title: string;
	id?: string;
	/** Zero-based row index to stagger the initial entrance animation. */
	index?: number;
}

export const StatsGroup: FC<PropsWithChildren<StatsGroupProps>> = ({
	title,
	id,
	children,
	index,
}) => {
	return (
		<GroupContainer
			id={id}
			className="wpac-rise-in"
			sx={{ animationDelay: `${Math.min((index ?? 0) * 45, 250)}ms` }}
		>
			<StyledTitle>{title}</StyledTitle>
			<div>{children}</div>
		</GroupContainer>
	);
};
