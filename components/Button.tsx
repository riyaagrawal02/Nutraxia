interface ButtonProps{
    label:string;
    onClick?: ()=>void;
}
export default function Button ({label, onClick}: ButtonProps){
    return(
        <button onClick={onClick} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition">{label}</button>
    );
}