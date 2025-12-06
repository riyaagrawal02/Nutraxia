"use client";

import { useState, ChangeEvent } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Profile() {
  const [data, setData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
    goal: "",
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    console.log("Profile saved:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 px-4 py-6">
      
      
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Health Profile</h1>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Help Nutraxia personalize your wellness plan by completing your health profile.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <InputField 
            label="Age" 
            name="age" 
            value={data.age} 
            onChange={handleChange} 
          />

          <SelectField
            label="Gender"
            name="gender"
            value={data.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          <InputField 
            label="Height (cm)"
            name="height"
            value={data.height}
            onChange={handleChange}
          />

          <InputField 
            label="Weight (kg)"
            name="weight"
            value={data.weight}
            onChange={handleChange}
          />

          <SelectField
            label="Activity Level"
            name="activity"
            value={data.activity}
            onChange={handleChange}
            options={[
              "Sedentary (little or no exercise)",
              "Light exercise (1–3 days/week)",
              "Moderate exercise (4–5 days/week)",
              "Heavy exercise (daily)",
            ]}
          />

          <SelectField
            label="Main Goal"
            name="goal"
            value={data.goal}
            onChange={handleChange}
            options={[
              "Weight Loss",
              "Weight Gain",
              "Build Muscle",
              "Improve Sleep",
              "General Wellness",
            ]}
          />

        </div>

        
        <button
          onClick={saveProfile}
          className="w-full md:w-fit px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition"
        >
          Save Profile
        </button>

      </div>
    </div>
  );
}


function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
