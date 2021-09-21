import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    if (props.disabled) {
        return (
            <button {...props} className="rounded-md cursor-not-allowed bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2" />
        )
    }

    return (
        <button {...props} className="rounded-md bg-gray-200 hover:bg-gray-300 transition-colors text-sm font-medium px-4 py-2" />
    )
}
