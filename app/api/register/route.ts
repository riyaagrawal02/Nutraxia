import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export async function POST(req:Request){
    try{
        const{name,email, password}= await req.json();
        await connectDB();
        console.log("MONGO:", process.env.MONGODB_URI);


        const existing = await User.findOne({email});
        if(existing)
            return NextResponse.json({
        success:false, message:"User already exists"},
    {status:400});
    const hashed= await bcrypt.hash(password,10);
    const user= await User.create({
        name, email, password:hashed,
    });
    return NextResponse.json({success:true, user});
    }
    catch(error){
        return NextResponse.json({
            success:false, message:"Server error"
        },{
            status:500
        });
    }
}