import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className="text-center rounded p-2 bg-gray-100 hover:bg-gray-200 transition-colors" {...props} />
    )
}
