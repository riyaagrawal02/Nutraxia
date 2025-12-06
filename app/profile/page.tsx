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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 px-4 py-10">
      
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-10">
        <div>
          <h1 className="text-3xl font-bold">Health Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your personalized wellness starts here.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg space-y-10">
        
       
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Nutraxia uses this information to generate a personalized diet plan, 
          exercise suggestions, smart reminders, and wellness insights tailored 
          specifically for you.
        </p>

       
        <SectionLabel title="Basic Information" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <SectionLabel title="Body Metrics" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <SectionLabel title="Lifestyle & Goals" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

       
        <div className="pt-4">
          <button
            onClick={saveProfile}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-md hover:shadow-lg"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition"
      >
        <option value="">Select...</option>
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold mt-4 mb-2 text-emerald-600 dark:text-emerald-400">
      {title}
    </h2>
  );
}
