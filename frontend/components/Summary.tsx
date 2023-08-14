interface Props {
    title: string;
}

const TITLE_RE = /([\w\d]+) ([\w\s]*) 000001\/([\w ]+)\/[\w\d]+/;
const LETTER_RE = /^([^\d]+)/;

function typeToEng(type: string) {
    switch (type.match(LETTER_RE)[1].toLowerCase()) {
        case 'tut': return "Tutorial";
        case 'prac': return "Practical";
        case 'smg': return "Small Group";
        case 'workshop': return "Workshop";
        case 'lecture': return "Lecture";
        case 'skills': return "Skills";
        case 'discussion': return "Discussion";
        case 'clinical': return "Clinical";
        case 'drop in session': return "Drop in Session";
        case 'sem': return "Seminar";
        default: return type;
    }
}

function typeToColor(type: string) {
    switch (type.match(LETTER_RE)[1].toLowerCase()) {
        case 'tut': return "bg-blue-600";
        case 'prac': return "bg-yellow-600";
        case 'smg': return "bg-green-600";
        case 'workshop': return "bg-indigo-600";
        case 'lecture':
        case 'skills': return "bg-red-600";
        case 'discussion': return "bg-gray-600";
        case 'clinical':
        case 'drop in session': return "bg-pink-600";
        case 'sem': return "bg-purple-600";
        default: return "bg-black";
    }
}

export function extractType(title: string): string | null {
    const match = title.match(TITLE_RE);
    if (match) {
        const [, , , type] = match;
        return typeToEng(type);
    }
    return null;
}

export default function Summary({ title }: Props) {
    const v = title.match(TITLE_RE);
    if (v) {
        const [_, code, name, type] = v;

        return (
            <span className="text-lg flex gap-2 items-baseline">
                <span className={`${typeToColor(type)} text-white rounded-md px-2`}>{ typeToEng(type) }</span>
                <span className="capitalize">{ ' ' + name.toLowerCase() }</span>
                <span className="text-sm text-gray-600">{ code }</span>
            </span>
        )
    }

    return (
        <span className="text-lg">{ title }</span>
    )
}
