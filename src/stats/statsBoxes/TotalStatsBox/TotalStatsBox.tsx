import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { computeDelta } from "../../../utils/deltas.js";
import { sumFor } from "../../../utils/sumFor.js";
import { DistanceStatsBox } from "../DistanceStatsBox/DistanceStatsBox.js";

interface Props {
	title: string;
	data: Entry[];
	/** Data of the preceding period to compare the total against. */
	previousData?: Entry[];
	deltaLabel?: string;
}

export const TotalStatsBox: FC<Props> = ({
	title,
	data,
	previousData,
	deltaLabel,
}) => {
	const total = useMemo(() => sumFor(data), [data]);
	const previousTotal = useMemo(
		() => (previousData ? sumFor(previousData).steps : 0),
		[previousData],
	);
	const delta = useMemo(
		() => computeDelta(total.steps, previousTotal, deltaLabel ?? ""),
		[total, previousTotal, deltaLabel],
	);

	return (
		<DistanceStatsBox
			title={title}
			entry={total}
			date={undefined}
			delta={delta}
		/>
	);
};
