"use client"
import { useState, ChangeEvent } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";

export default function Register(){
    const[data, setData]= useState({
        name:"",
        email:"",
        password:"",
    });
    const handleChange= (e:ChangeEvent<HTMLInputElement>)=>{setData({...data,[e.target.name]:e.target.value});
};
    const handleRegister = async () => {
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-[360px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-teal-600">
          Create Account
        </h1>

        <div className="flex flex-col gap-4">
          <Input label="Name" name="name" onChange={handleChange} />
          <Input label="Email" name="email" onChange={handleChange} />
          <Input label="Password" type="password" name="password" onChange={handleChange} />

          <Button label="Register" onClick={handleRegister} />

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}