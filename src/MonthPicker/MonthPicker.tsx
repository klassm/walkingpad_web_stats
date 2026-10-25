import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { type FC, useState } from "react";

interface Props {
	value: DateTime<true>;
	min: DateTime;
	onChange: (date: DateTime<true>) => void;
}

export const MonthPicker: FC<Props> = ({ value, min, onChange }) => {
	const [open, setOpen] = useState(false);
	return (
		<DatePicker
			views={["year", "month"]}
			// No label: the word "Month" adds nothing in the header and the
			// label alone inflates the field far above the other header
			// controls (chip 34px, toggle ~44px).
			minDate={min}
			maxDate={DateTime.local()}
			value={value}
			onChange={(newDate) =>
				onChange((newDate ?? DateTime.local()) as DateTime<true>)
			}
			disableFuture
			// The whole field (not just the calendar icon) opens the popup.
			// The default icon button is hidden — the pill-shaped field itself
			// is the affordance, matching the header chip and mode toggle.
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			slots={{ openPickerButton: () => null }}
			slotProps={{
				textField: {
					onClick: () => setOpen(true),
					size: "small",
					variant: "outlined",
					sx: {
						width: 130,
						flexShrink: 0,
						// Match the header controls (status chip, mode toggle):
						// translucent dark pill, no bright outlined box.
						// x-date-pickers fields render their own classes
						// (MuiPickersOutlinedInput-root), NOT MuiOutlinedInput.
						"& .MuiPickersOutlinedInput-root": {
							borderRadius: 2,
							height: 40,
							alignItems: "center",
							bgcolor: "action.hover",
							color: "text.primary",
							cursor: "pointer",
							// Translucent dark pill matching the header controls
							// (status chip, mode toggle); renders with the month
							// name in both the header slot and the nav drawer.
							paddingX: 2,
							"& fieldset": { borderColor: "transparent" },
							"&:hover fieldset": { borderColor: "transparent" },
							"&.Mui-focused fieldset": { borderColor: "primary.main" },
							"& .MuiSvgIcon-root": { color: "text.secondary" },
						},
						"& .MuiPickersInputBase-input": {
							py: 0,
							fontSize: 14,
							color: "text.primary",
						},
					},
				},
			}}
		/>
	);
};
