import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await connectToDatabase();
    res.send({
        events: await client.db('kcl-timetables').collection('events').find({}).toArray(),
        users: await client.db('kcl-timetables').collection('users').find({}).toArray()
    });
}
