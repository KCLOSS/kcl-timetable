import Link from 'next/link';
import Avatar from './Avatar';
import Button from './Button';
import { User } from '../lib/entities';

interface Props {
    user?: User
}

export default function Navbar({ user }: Props) {
    return (
        <div className="flex items-center p-4">
            insert#0751 &middot; <a href="">contact me</a> &middot; <a href="https://gitlab.insrt.uk/insert/kcl-timetable">source code</a>
        </div>
    )
}
