import { DateTime } from "luxon";
import { FC, useMemo } from "react";
import { ByDayGraph } from "../../ByDayGraph/ByDayGraph";
import { ByMonthGraph } from "../../ByMonthGraph/ByMonthGraph";
import { Entry } from "../../fetchData";
import { StatsBar } from "../StatsBar/StatsBar";
import { AverageStatsBox } from "../statsBoxes/AverageStepsBox/AverageStatsBox";
import { TopDayStatsBox } from "../statsBoxes/TopDayStatsBox/TopDayStatsBox";
import { TotalStatsBox } from "../statsBoxes/TotalStatsBox/TotalStatsBox";
import { StatsGroup } from "../StatsGroup/StatsGroup";

export interface Props {
  data: Entry[]
  month: DateTime
}
export const StatsContent: FC<Props> = ({ data, month: selectedMonth }) => {
  const monthData = useMemo(() =>
      data.filter(entry => entry.date.year === selectedMonth.year && entry.date.month === selectedMonth.month),
    [data, selectedMonth]
  );

  const yearData = useMemo(() => data.filter(entry => entry.date.year === selectedMonth.year), [selectedMonth, data]);

  const thirtyDaysAgo = DateTime.now().minus({days: 30});
  const last30Days = data.filter(({date}) => date.toMillis() > thirtyDaysAgo.toMillis());

  const year = selectedMonth.year;
  const month = selectedMonth.toFormat("yyyy-MM");


  return (
    <div>
      <StatsGroup title="Top Day">
        <StatsBar>
          <TopDayStatsBox title="Overall" data={data} />
          <TopDayStatsBox title={ `${ year }` } data={ yearData } />
          <TopDayStatsBox title={ month } data={ monthData } />
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Total">
        <StatsBar>
          <TotalStatsBox title="Overall" data={ data }/>
          <TotalStatsBox title={ `${ year }` } data={ yearData }/>
          <TotalStatsBox title={ month } data={ monthData }/>
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Average">
        <StatsBar>
          <AverageStatsBox title="Overall" data={ data }/>
          <AverageStatsBox title={ `${ year }` } data={ yearData } />
          <AverageStatsBox title={ month } data={ monthData } />
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Last 12 months">
        <ByMonthGraph data={ data }/>
      </StatsGroup>

      <StatsGroup title="Last 30 days">
        <ByDayGraph data={ last30Days }/>
      </StatsGroup>
    </div>
  );
}
