import { db } from "./db";

import { Event, User } from "./lib/entities";
import { fetchAndParse } from './lib/cal';

import { writeFile } from "fs/promises";

export async function sync() {
    const users = await db.collection('users').find().toArray() as User[];
    const events: Record<string, Event> = { };
    for (const user of users) {
        console.log(`Processing ${user.firstname.replace(/\r/g, '')}${user.surname ? ` ${user.surname}` : ''} - ${user._id}`);

        let tries = 0,
            data;
        
        while (!data) {
            if (tries > 0) console.log(`Try ${tries + 1}`);
            if (tries > 4) break;

            try {
                const { data: d } = await fetchAndParse(user._id);
                data = d;
            } catch (err) {
                tries++;
            }
        }

        if (data) {
            for (const event of data) {
                if (events[event._id]) {
                    events[event._id].people!.push(user._id);
                } else {
                    events[event._id] = {
                        ...event,
                        people: [user._id]
                    };
                }
            }
        }
    }

    const current = await db.collection('events').find().toArray() as Event[];
    writeFile('backup.json.0', JSON.stringify(current));

    const new_events = Object.keys(events).map(key => events[key]);
    writeFile('backup.json.1', JSON.stringify(new_events));

    await db.collection('events').deleteMany({});
    await db.collection('events').insertMany(new_events as any);

    console.log('We are done!');
}
