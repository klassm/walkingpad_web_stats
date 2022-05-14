import { maxBy } from "lodash";
import { FC, useMemo } from "react";
import { Entry } from "../../../fetchData";
import { formatDate } from "../../../utils/formatDate";
import { DistanceStatsBox } from "../DistanceStatsBox/DistanceStatsBox";

interface Props {
  title: string;
  data: Entry[];
}

export const TopDayStatsBox: FC<Props> = ({ title, data }) => {
  const maxEntry = useMemo(() => maxBy(data, entry => entry.steps), [data])

  return <DistanceStatsBox title={title} entry={ maxEntry } date={ formatDate(maxEntry) }/>;
}
