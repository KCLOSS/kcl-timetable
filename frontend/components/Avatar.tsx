import { User } from "../lib/entities";

interface Props {
    offset?: number;
    small?: boolean;
    user: User;
}

/*// Due to a limitation in Tailwind
// we need to specify full strings.
const OFFSETS = [
    'left-0',
    'left-4',
    'left-8',
    'left-12',
    'left-16',
    'left-20',
    'left-24',
    'left-28',
    'left-32',
    'left-36',
    'left-40'
];*/

export default function Avatar({ offset, small, user }: Props) {
    const size = small ? `w-8 h-8` : `w-12 h-12`;

    if (!user.avatar) {
        return (
            <div className={`${size} flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center sus`}>
                { user.firstname[0] }
                { user.surname && user.surname[0] }
            </div>
        )
    }

    return (
        <img className={`${size} flex-shrink-0 rounded-full object-cover sus`} src={user.avatar} />
    )
}
