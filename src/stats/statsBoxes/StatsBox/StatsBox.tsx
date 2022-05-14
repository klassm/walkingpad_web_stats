import { CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { StyledCard, StyledDate, StyledTitle } from "./StatsBox.styles";

interface Props {
  title: string;
  description?: string;
  date?: string;
  entries: string[]
}

export const StatsBox: FC<Props> = ({ title, date, description, entries }) => {
  if (entries.length === 0) {
    return null;
  }

  const printableEntries = entries.map(entry => ( <Typography variant="body2">{ entry }</Typography> ))
  const printableDescription = description && (
    <StyledDate sx={ { mb: 1.5 } } color="text.secondary">
      { description ?? "" }
    </StyledDate>
  )
  return ( <StyledCard variant="outlined">
      <CardContent>
        <StyledTitle gutterBottom variant="h6">
          { title }
        </StyledTitle>
        <StyledDate sx={ { mb: 1.5 } } color="text.secondary">
          { date ?? "" }
        </StyledDate>
        { printableDescription }
        <div>
          { printableEntries }
        </div>
      </CardContent>
    </StyledCard>
  )

}
