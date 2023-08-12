import Preloader from "./Preloader";
import { useEffect, useMemo, useState } from "react";
import { Event, User } from "../lib/entities";
import { GroupedVirtuoso } from "react-virtuoso";
import Category from "./Category";
import Entry from "./Entry";

export type EventWithUsers = Omit<Event, 'people'> & { people: User[] };
export type Everything = { users: Record<string, User>, events: EventWithUsers[] };

type Props = Everything & { user?: string, filter: boolean, eventTypes?: string[] };
type Groups = { date: string, events: EventWithUsers[] }[];

export default function ListRenderer({ users, events, user, filter, eventTypes }: Props) {
    const [groups, setGroups] = useState<Groups | undefined>();

    useEffect(() => {
        const groups = { };
        for (const event of events) {
            if (filter) {
                if (!event.people.find(x => x._id === user) || (eventTypes && !eventTypes?.includes(event.description))) continue;
            }

            const date = event.start.split('T').shift();
            
            if (groups[date]) {
                groups[date].push(event);
            } else {
                groups[date] = [event];
            }
        }
        
        const today = new Date();
        today.setUTCHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setDate(today.getDate() - 1);

        setGroups(
            Object
                .keys(groups)
                .map(date => {
                    return {
                        date,
                        events: groups[date]
                            .sort((b, a) => +new Date(b.start) - +new Date(a.start))
                    }
                })
                .filter(x => new Date(x.date) > today)
                .sort((b, a) => +new Date(b.date) - +new Date(a.date))
        );
    }, [users, events, filter, eventTypes]);

    const groupCounts = useMemo(() => groups ? groups.map(x => x.events.length) : [], [ groups ]);

    if (typeof groups === 'undefined') return <Preloader />;

    return (
        <div className="flex-grow">
            <GroupedVirtuoso
                groupCounts={groupCounts}
                groupContent={index => {
                    return (
                        <Category key={index} raw={groups[index].date} />
                    )
                }}
                itemContent={(absoluteIndex, groupIndex) => {
                    const relativeIndex =
                        absoluteIndex -
                        groups
                            .slice(0, groupIndex)
                            .reduce((a, b) => a + b.events.length, 0);

                    return (
                        <Entry
                            user={user}
                            key={absoluteIndex}
                            event={groups[groupIndex].events[relativeIndex]}
                        />
                    )
                }}
            />
        </div>
    )
}
