import { User } from "../lib/entities";
import Avatar from './Avatar';

interface Props {
    people: User[];
    overflow: number;
}

export default function AvatarGroup({ people, overflow }: Props) {
    return (
        <div className="flex items-center">
            {
                people
                    .slice(0, overflow)
                    .map((user, i) => <Avatar key={user._id} user={user} offset={Math.min(people.length, overflow) - i - 1} />)
            }
            { people.length > overflow && <span className="pl-2 text-gray-700">+ {people.length - overflow} more</span> }
        </div>
    )
}
