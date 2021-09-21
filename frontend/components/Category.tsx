import dayjs from "dayjs";
import { useMemo } from "react"

import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

interface Props {
    raw: string
}

export default function Category({ raw }: Props) {
    const date = useMemo(() => dayjs(raw).format('Do of MMMM'), [raw]);

    return (
        <div className="select-none flex pt-8 pb-2 bg-white z-50">
			<div className="uppercase">{ date }</div>
		</div>
    )
}
