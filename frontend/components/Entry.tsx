import dayjs from "dayjs";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";
import { EventWithUsers } from "./ListRenderer";

interface Props {
    event: EventWithUsers;
	user?: string;
}

export default function Entry({ event, user }: Props) {
	const self = user && event.people.find(x => x._id === user);

    return (
		<div className="py-1 z-0">
			<Link href={`/event/${event._id}`}>
				<a>
					<div className={`flex flex-col gap-4 lg:flex-row lg:gap-0 select-none rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer p-4 shadow-sm items-center ${self ? `border border-indigo-500` : ''}`}>
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
						<AvatarGroup people={event.people} overflow={5} />
					</div>
				</a>
			</Link>
		</div>
    )
}
