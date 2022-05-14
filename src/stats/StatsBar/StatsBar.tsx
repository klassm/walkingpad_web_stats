import { FC } from "react";
import { StyledStatsTopBar } from "./StatsBar.styles";


export const StatsBar: FC = ({children}) => {
  return (
    <StyledStatsTopBar>
      {children}
    </StyledStatsTopBar>
  )
}
