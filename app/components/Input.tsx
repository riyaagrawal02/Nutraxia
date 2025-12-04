import React from "react";

interface InputProps{
    label: string;
    name?:string;
    value?: string;
    type?: string;
    onChange?:(e: React.ChangeEvent<HTMLInputElement>)=> void;
}

export default function Input({
    label,
    name,
    type="text",
    value,
    onChange,
}: InputProps){
    return(
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input name={name}
            value={value} type={type} onChange={onChange} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"/>
        </div>
    );
}