import { User } from "../lib/entities";

interface Props {
    offset?: number;
    small?: boolean;
    user: User;
}

// Due to a limitation in Tailwind
// we need to specify full strings.
const OFFSETS = [
    'left-0',
    'left-4',
    'left-8',
    'left-12',
    'left-16',
    'left-20',
    'left-24'
];

export default function Avatar({ offset, small, user }: Props) {
    const size = small ? `w-8 h-8` : `w-12 h-12`;

    if (!user.avatar) {
        return (
            <div className={`${size} flex-shrink-0 rounded-full relative bg-gray-300 flex items-center justify-center ${OFFSETS[(offset ?? 0) * 4]}`}>
                { user.firstname[0] }
                { user.surname && user.surname[0] }
            </div>
        )
    }

    return (
        <img className={`${size} flex-shrink-0 rounded-full object-cover relative ${OFFSETS[(offset ?? 0) * 4]}`} src={user.avatar} />
    )
}
