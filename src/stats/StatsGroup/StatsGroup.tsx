import { FC } from "react";
import { GroupContainer, StyledTitle } from "./StatsGroup.styles";

interface Props {
  title: string;
}

export const StatsGroup: FC<Props> = ({ title, children }) => {
  return (
    <GroupContainer>
      <StyledTitle variant="h3">{title}</StyledTitle>
      <div>{children}</div>
    </GroupContainer>
  )
}
