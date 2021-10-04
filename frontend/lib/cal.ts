import axios from "axios";
import ical from 'node-ical';
import { Event } from "./entities";
import { Collection } from "mongodb";

const NAME_RE = /^X-WR-CALNAME:([^\n]*)$/mi;

export async function fetchAndParse(identity: string): Promise<{ data: Event[], firstname: string }> {
    const res = await axios(`https://scientia-eu-v2-4-api-d4-02.azurewebsites.net/api/ical/${process.env.INSTITUTE}/${identity}/timetable.ics`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36"
        },
        timeout: 5000
    });

    const data = res.data;
    const events = await ical.async.parseICS(data);

    return {
        data: Object.keys(events)
            .map(x => events[x])
            .filter(x => x.type === 'VEVENT')
            .map(x => {
                const { uid, start, end, description, location, summary } = x;
                
                return {
                    _id: uid,
                    start,
                    end,
                    description,
                    location,
                    summary
                } as unknown as Event
            }),
        firstname: data.match(NAME_RE)[1]
    };
}

export async function saveEvents(collection: Collection, events: Event[], identity: string) {
    const $in = events.map(x => x._id);
    const arr = await collection.find({ _id: { $in } }).toArray();

    let update_ids = [];
    for (const existing of arr) {
        update_ids.push(
            events.splice(events.findIndex(x => x._id === existing._id), 1)[0]._id
        );
    }

    if (events.length > 0) {
        await collection
            .insertMany(events.map(event => {
                return {
                    ...event,
                    people: [ identity ]
                }
            }) as any);
    }

    if (update_ids.length > 0) {
        await collection
            .updateMany({ _id: $in }, {
                $addToSet: {
                    people: identity
                }
            } as any);
    }
}
