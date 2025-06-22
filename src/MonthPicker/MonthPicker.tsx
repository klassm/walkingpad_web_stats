import { DatePicker } from "@mui/x-date-pickers";

import { DateTime } from "luxon";
import { FC } from "react";
import { MonthPickerContainer } from "./MonthPicker.styles";
import { TextField } from "@mui/material";

interface Props {
  value: DateTime,
  min: DateTime,
  onChange: (date: DateTime) => void
}

export const MonthPicker: FC<Props> = ({ value, min, onChange }) => {
  return (
    <MonthPickerContainer>
      <DatePicker
        views={ ['year', 'month'] }
        label="Month"
        minDate={ min }
        maxDate={ DateTime.local() }
        value={ value }
        onChange={ (newDate) => onChange(newDate ?? DateTime.local()) }
        disableFuture
        slotProps={{ textField: { size: 'small', variant: 'standard' } }}
      />
    </MonthPickerContainer>
  )
}
