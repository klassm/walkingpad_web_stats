import { AppBar, Box, CircularProgress, Container, Toolbar, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { FC, useState } from "react";
import { useData } from "../fetchData";
import { MonthPicker } from "../MonthPicker/MonthPicker";
import { StatsContent } from "../stats/StatsContent/StatsContent";
import { Content } from "./Main.styles";

export const Main: FC = () => {
  const { isLoading, data } = useData();
  const [month, setMonth] = useState(DateTime.local());

  if (isLoading || !data) {
    return <CircularProgress variant="indeterminate"/>
  }

  return (
    <>
      <AppBar position="static"><Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={ { mr: 2, display: { xs: 'none', md: 'flex' }, flexGrow: 1 } }
          >
            WalkingPad Stats
          </Typography>

          <Box sx={ { flexGrow: 0 } }>
            <MonthPicker value={ month } min={ data[0].date } onChange={ setMonth }/>
          </Box>
        </Toolbar>
      </Container>
      </AppBar>

      <Content maxWidth="md">
        <StatsContent data={ data } month={ month }/>
      </Content>
    </>
  )
}
