import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";
import { DateTime } from "luxon";
import { FC } from "react";
import { MonthPickerContainer } from "./MonthPicker.styles";

interface Props {
  value: DateTime,
  min: DateTime,
  onChange: (date: DateTime) => void
}

export const MonthPicker: FC<Props> = ({ value, min, onChange }) => {
  return (
    <MonthPickerContainer>
      <DatePicker<DateTime>
        views={ ['year', 'month'] }
        label="Month"
        minDate={ min }
        maxDate={ DateTime.local() }
        value={ value }
        onChange={ (newDate) => onChange(newDate ?? DateTime.local()) }
        renderInput={ (params) => <TextField variant="standard" { ...params } helperText={ null }/> }
      />
    </MonthPickerContainer>
  )
}
