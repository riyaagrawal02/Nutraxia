import mongoose, {Schema, Document, Model} from "mongoose";
export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
}

const UserSchema: Schema<IUser>= new Schema({
    name:{type:String},
    email:{type:String, unique:true},
    password:{type:String},
},
    {timestamps:true}
);
const User: Model<IUser>=mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;