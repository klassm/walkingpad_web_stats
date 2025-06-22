import { FC, PropsWithChildren } from "react";
import { GroupContainer, StyledTitle } from "./StatsGroup.styles";

interface StatsGroupProps {
  title: string;
}

export const StatsGroup: FC<PropsWithChildren<StatsGroupProps>> = ({ title, children }) => {
  return (
    <GroupContainer>
      <StyledTitle variant="h3">{title}</StyledTitle>
      <div>{children}</div>
    </GroupContainer>
  )
}
