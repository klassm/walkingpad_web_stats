import type { FC, PropsWithChildren } from "react";
import { StyledStatsTopBar } from "./StatsBar.styles.js";

export const StatsBar: FC<PropsWithChildren> = ({ children }) => {
	return <StyledStatsTopBar>{children}</StyledStatsTopBar>;
};
