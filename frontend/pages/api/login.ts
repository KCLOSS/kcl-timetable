import { fetchAndParse, saveEvents } from '../../lib/cal';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { serialize } from 'cookie';

const UUID = `[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).send('');

    const client = await connectToDatabase();
    const users = client.db('timetables').collection('users');
    const events = client.db('timetables').collection('events');

    const id = req.body.id;
    if (typeof id === 'string') {
        const matches = id.match(UUID);
        if (matches === null) return res.status(400).send('Bad UUID.');

        const _id = matches[0];
        const user = await users.findOne({ _id });

        res.setHeader('Set-Cookie', serialize('Identity', _id, { maxAge: 3600 * 24 * 30 * 12, path: '/' }));

        if (user) {
            res.redirect('/profile');
        } else {
            const { data, firstname } = await fetchAndParse(_id);
            await saveEvents(events, data, _id);
            await users.insertOne({ _id: _id as any, firstname });

            res.redirect('/profile');
        }
    } else {
        res.status(400).send('Invalid data type.')
    }
}
