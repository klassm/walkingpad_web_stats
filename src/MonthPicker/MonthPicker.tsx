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
						width: 150,
						flexShrink: 0,
						// Clicking focuses the field, and MUI programmatically
						// selects the active section via the DOM Selection API
						// (syncSelectionToDOM) — userSelect can't prevent a
						// scripted selection, and the highlight first paints on
						// the field root before narrowing to the section. So
						// make the native selection invisible across the whole
						// field; the popup is the feedback instead.
						"&& ::selection": {
							background: "transparent",
							color: "inherit",
						},
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
							paddingX: 1.5,
							"& fieldset": { borderColor: "transparent" },
							"&:hover fieldset": { borderColor: "transparent" },
							"&.Mui-focused fieldset": { borderColor: "primary.main" },
							"& .MuiSvgIcon-root": { color: "text.secondary" },
						},
						// The picker renders its text as section spans inside
						// .MuiPickersInputBase-sectionsContainer (NOT an <input>;
						// .MuiPickersInputBase-input is a hidden helper). That
						// container has a hardcoded width: 182px + overflow hidden,
						// which clips "October 2026" inside the narrow pill — so
						// let it size to its content and apply the font size here.
						"& .MuiPickersInputBase-sectionsContainer": {
							width: "auto",
							padding: 0,
							fontSize: 14,
							cursor: "pointer",
						},
						// The field is a popup affordance, not a text input: clicking
						// it must not select the month text. userSelect alone is not
						// enough — MUI programmatically selects the active section
						// via the DOM Selection API when the field is focused
						// (syncSelectionToDOM), so make that native selection
						// highlight invisible; the popup is the feedback instead.
						"& .MuiPickersSectionList-sectionContent": {
							userSelect: "none",
						},
					},
				},
			}}
		/>
	);
};
