import { ButtonHTMLAttributes } from "react";

export default function Input(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <input className="text-center rounded p-2 bg-gray-100 hover:bg-gray-200 transition-colors" {...props} />
    )
}
