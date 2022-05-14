import { FC } from "react";
import { StatsBox } from "../StatsBox/StatsBox";
import { DistanceStatsBoxEntry } from "../../../utils/DistanceStatsBoxEntry";

interface Props {
  title: string;
  entry: DistanceStatsBoxEntry | undefined
  date: string | undefined;
}

export const DistanceStatsBox: FC<Props> = ({title, entry, date}) => {
  if (!entry) {
    return null;
  }
  return (<StatsBox title={title} date={date ?? ""} entries={[
    `${Math.round(entry.steps)} steps`,
    `${Math.round(entry.distance)} meters`,
  ]}/>)
}
