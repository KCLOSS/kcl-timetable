import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', serialize('Identity', '', { maxAge: 0, path: '/' }));
    res.redirect('/');
}
