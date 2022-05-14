import { FC } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Entry } from "../fetchData";

export interface Props {
  data: Entry[]
}

export const ByDayGraph: FC<Props> = ({ data}) => {

  const formatted = data
    .map((entry) => ( { ...entry, date: entry.date.toFormat("yyyy-MM-dd") } ));

  return (
    <ResponsiveContainer height={ 300 }>
      <LineChart
        data={ formatted }
        margin={ {
          top: 15,
          right: 5,
          left: 30,
          bottom: 5,
        } }
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis tick={ { fontSize: 12 } } dataKey="date"/>
        <YAxis tick={ { fontSize: 10 } } width={ 18 }/>
        <Legend/>
        <Tooltip formatter={ (value: number) => `${ Math.ceil(value) }` }/>
        <Line name="Steps" type="monotone" dataKey="steps" stroke="#2a801d"/>
      </LineChart>
    </ResponsiveContainer>
  )
}
