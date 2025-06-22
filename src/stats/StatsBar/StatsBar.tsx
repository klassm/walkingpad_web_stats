import { FC, PropsWithChildren } from "react";
import { StyledStatsTopBar } from "./StatsBar.styles";


export const StatsBar: FC<PropsWithChildren> = ({children}) => {
  return (
    <StyledStatsTopBar>
      {children}
    </StyledStatsTopBar>
  )
}
