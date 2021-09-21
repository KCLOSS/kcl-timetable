import Link from 'next/link';
import Avatar from './Avatar';
import Button from './Button';
import { User } from '../lib/entities';

interface Props {
    user?: User
}

export default function Navbar({ user }: Props) {
    return (
        <div className="flex items-center">
            <div className="text-2xl flex-grow">
                <Link href='/'>
                    <a>KCL Timetables</a>
                </Link>
            </div>
            { user ? <Link href='/profile'>
                <a>
                    <Avatar user={user} small />
                </a>
            </Link> : <Link href='/login'>
                <a>
                    <Button>Login</Button>
                </a>
            </Link> }
        </div>
    )
}
