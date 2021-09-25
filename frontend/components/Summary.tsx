interface Props {
    title: string;
}

const TITLE_RE = /([\w\d]+) ([\w\s]*) 000001\/([\w]+)\/[\d]+/;

function typeToEng(type: string) {
    switch (type) {
        case 'Tut': return "Tutorial";
        case 'Prac': return "Practical";
        case 'SmG': return "Small Group";
        case 'Workshop': return "Workshop";
        default: return type;
    }
}

function typeToColor(type: string) {
    switch (type) {
        case 'Tut': return "bg-blue-600";
        case 'Prac': return "bg-yellow-600";
        case 'SmG': return "bg-green-600";
        case 'Workshop': return "bg-indigo-600";
        default: return "bg-black";
    }
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
