import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import type { FC } from "react";
import { MonthPickerContainer } from "./MonthPicker.styles.js";

interface Props {
	value: DateTime<true>;
	min: DateTime;
	onChange: (date: DateTime<true>) => void;
}

export const MonthPicker: FC<Props> = ({ value, min, onChange }) => {
	return (
		<MonthPickerContainer>
			<DatePicker
				views={["year", "month"]}
				label="Month"
				minDate={min}
				maxDate={DateTime.local()}
				value={value}
				onChange={(newDate) =>
					onChange((newDate ?? DateTime.local()) as DateTime<true>)
				}
				disableFuture
				slotProps={{
					textField: {
						size: "small",
						variant: "outlined",
						sx: {
							width: 130,
							"& .MuiOutlinedInput-root": { borderRadius: 2.5 },
							"& .MuiInputBase-input": { py: 0.75, fontSize: 14 },
						},
					},
				}}
			/>
		</MonthPickerContainer>
	);
};
