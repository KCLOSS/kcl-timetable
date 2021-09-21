import dayjs from "dayjs";
import Avatar from "./Avatar";
import { EventWithUsers } from "./ListRenderer";

interface Props {
    event: EventWithUsers;
	user?: string;
}

const OVERFLOW = 5;

export default function Entry({ event, user }: Props) {
	const self = user && event.people.find(x => x._id === user);

    return (
		<div className="py-1 z-0">
			<div className={`select-none rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer p-4 shadow-sm flex items-center ${self ? `border border-indigo-500` : ''}`}>
				<div className="flex-grow">
					<span className="text-lg">{ event.summary }</span>
					<div className="flex gap-1">
						<span className="text-indigo-800">{ dayjs(event.start).format("HH:mm") }-{ dayjs(event.end).format("HH:mm") }</span>
						{ event.location && <><span>at</span>
						<span className="text-indigo-800">{ event.location }</span></> }
						{ !event.location && <><span>is an</span>
						<span className="text-indigo-800">Online Event</span></> }
					</div>
				</div>
				<div className="flex items-center">
					{
						event.people
							.slice(0, OVERFLOW)
							.map((user, i) => <Avatar key={user._id} user={user} offset={Math.min(event.people.length, OVERFLOW) - i - 1} />)
					}
					{ event.people.length > OVERFLOW && <span className="pl-2 text-gray-700">+ {event.people.length - OVERFLOW} more</span> }
				</div>
			</div>
		</div>
    )
}
