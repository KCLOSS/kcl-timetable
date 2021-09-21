import { NextApiRequest, NextApiResponse } from 'next';
import { findUser } from '../../lib/auth';

const WHITELIST = [
    'cdn.discordapp.com',
    'autumn.revolt.chat',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).send('');

	const { Identity } = req.cookies;
    const { user, client } = await findUser(Identity);
    if (!user) return res.status(401).send('Not authenticated!');

    let { surname, avatar, bio } = req.body;
    if ((surname && typeof surname !== 'string') ||
        (avatar && typeof avatar !== 'string') ||
        (bio && typeof bio !== 'string')) return res.status(400).send('Bad data.');

    // Just in case.
    surname = surname?.slice(0, 64);
    avatar = avatar?.slice(0, 256);
    bio = bio?.slice(0, 64);

    if (avatar) {
        try {
            const url = new URL(avatar);
            if (!WHITELIST.includes(url.hostname)) {
                return res.status(400).send('URL not whitelisted!');
            }
        } catch (err) {
            return res.status(400).send('Bad URL!');
        }
    }

    await client
        .db('timetables')
        .collection('users')
        .updateOne({ _id: Identity }, { $set: { surname, avatar, bio } });

    res.status(200).send('OK');
}
