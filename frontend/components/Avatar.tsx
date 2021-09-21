import { User } from "../lib/entities";

interface Props {
    offset?: number;
    size?: number;
    user: User;
}

export default function Avatar({ size, offset, user }: Props) {
    if (!user.avatar) {
        return (
            <div className={`w-${size ?? 12} h-${size ?? 12} flex-shrink-0 rounded-full relative bg-gray-300 flex items-center justify-center left-${(offset ?? 0) * 4}`}>
                { user.firstname[0] }
                { user.surname && user.surname[0] }
            </div>
        )
    }

    return (
        <img className={`w-${size ?? 12} h-${size ?? 12} flex-shrink-0 rounded-full object-cover relative left-${(offset ?? 0) * 4}`} src={user.avatar} />
    )
}
