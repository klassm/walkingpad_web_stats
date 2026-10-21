import type { FC, PropsWithChildren } from "react";
import { GroupContainer, StyledTitle } from "./StatsGroup.styles.js";

interface StatsGroupProps {
	title: string;
	id?: string;
}

export const StatsGroup: FC<PropsWithChildren<StatsGroupProps>> = ({
	title,
	id,
	children,
}) => {
	return (
		<GroupContainer id={id}>
			<StyledTitle>{title}</StyledTitle>
			<div>{children}</div>
		</GroupContainer>
	);
};
