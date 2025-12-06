"use client";

import { useState, useEffect, ChangeEvent } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type ProfileData = {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
};

type Errors = Partial<Record<keyof ProfileData, string>>;

export default function Profile() {
  const [data, setData] = useState<ProfileData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
    goal: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);   // initial skeleton
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setData((prev) => ({ ...prev, ...json.profile }));
            if (json.profile.avatarUrl) {
              setAvatarPreview(json.profile.avatarUrl);
            }
          }
        }
      } catch (err) {
        console.log("Profile fetch error (can ignore for now):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      setAvatarPreview(data.secure_url); 
    }
  } catch (err) {
    console.log("Cloudinary upload error:", err);
  }
};


  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!data.age) newErrors.age = "Age is required";
    if (!data.gender) newErrors.gender = "Please select your gender";
    if (!data.height) newErrors.height = "Height is required";
    if (!data.weight) newErrors.weight = "Weight is required";
    if (!data.activity) newErrors.activity = "Select your activity level";
    if (!data.goal) newErrors.goal = "Select your main goal";

   
    if (data.age && (isNaN(Number(data.age)) || Number(data.age) <= 0)) {
      newErrors.age = "Enter a valid age";
    }
    if (
      data.height &&
      (isNaN(Number(data.height)) || Number(data.height) < 80)
    ) {
      newErrors.height = "Enter a valid height in cm";
    }
    if (
      data.weight &&
      (isNaN(Number(data.weight)) || Number(data.weight) < 25)
    ) {
      newErrors.weight = "Enter a valid weight in kg";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validate()) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, avatarUrl: avatarPreview }),
      });

      if (!res.ok) {
        console.log("Profile save failed, status:", res.status);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.log("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };


  const totalFields = 6 + 1; 
  const filledCount =
    (data.age ? 1 : 0) +
    (data.gender ? 1 : 0) +
    (data.height ? 1 : 0) +
    (data.weight ? 1 : 0) +
    (data.activity ? 1 : 0) +
    (data.goal ? 1 : 0) +
    (avatarPreview ? 1 : 0);

  const completion = Math.round((filledCount / totalFields) * 100);
  console.log("filledCount:", filledCount, "completion:", completion);


  let bmi: number | null = null;
  let bmiCategory = "";
  let bmiTip = "";

  const heightNum = Number(data.height);
  const weightNum = Number(data.weight);

  if (heightNum > 0 && weightNum > 0) {
    const heightM = heightNum / 100;
    bmi = weightNum / (heightM * heightM);
    const b = bmi;

    if (b < 18.5) {
      bmiCategory = "Underweight";
      bmiTip = "Focus on calorie-dense, nutritious meals and strength training.";
    } else if (b < 25) {
      bmiCategory = "Normal";
      bmiTip = "Maintain your routine with balanced diet and regular activity.";
    } else if (b < 30) {
      bmiCategory = "Overweight";
      bmiTip = "Add more movement to your day and prioritize whole foods.";
    } else {
      bmiCategory = "Obese";
      bmiTip = "Consider a structured plan with gradual weight loss and guidance.";
    }
  }

  const activityTip =
    data.activity === "Sedentary (little or no exercise)"
      ? "Start with short 10–15 minute walks after meals."
      : data.activity === "Light exercise (1–3 days/week)"
      ? "Try moving to 4–5 days a week with a mix of cardio and light strength."
      : data.activity === "Moderate exercise (4–5 days/week)"
      ? "Great job! Add progressive overload to keep improving."
      : data.activity === "Heavy exercise (daily)"
      ? "Ensure enough recovery, sleep, and protein intake."
      : "";


  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 px-4 py-10 flex justify-center">
        <div className="max-w-4xl w-full space-y-6">
          <div className="h-10 w-40 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-[360px] bg-gray-200/80 dark:bg-slate-900/80 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 px-4 py-10">
      {/* Top bar */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your personalized wellness starts here.
          </p>
        </div>
        <ThemeToggle />
      </div>

      
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8 transition-transform duration-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-semibold text-white overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>N</span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs cursor-pointer shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                ✎
              </label>
            </div>

            <div>
              <p className="text-sm font-medium">Your basic profile</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add a picture and details so Nutraxia can recognize you.
              </p>
            </div>
          </div>

          
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">
                Profile completeness
              </span>
              <span className="font-medium">{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Nutraxia uses this information to generate a personalized diet plan,
          exercise suggestions, smart reminders, and wellness insights tailored
          specifically for you.
        </p>

      
        <SectionLabel title="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Age"
            name="age"
            value={data.age}
            onChange={handleChange}
            error={errors.age}
          />
          <SelectField
            label="Gender"
            name="gender"
            value={data.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            error={errors.gender}
          />
        </div>

        
        <SectionLabel title="Body Metrics" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Height (cm)"
            name="height"
            value={data.height}
            onChange={handleChange}
            error={errors.height}
          />
          <InputField
            label="Weight (kg)"
            name="weight"
            value={data.weight}
            onChange={handleChange}
            error={errors.weight}
          />
        </div>

        <SectionLabel title="Lifestyle & Goals" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            error={errors.activity}
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
            error={errors.goal}
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          <BMISuggestions bmi={bmi} bmiCategory={bmiCategory} bmiTip={bmiTip} />
          <AISummaryCard data={data} activityTip={activityTip} />
        </div>

        
        <div className="pt-4 flex flex-col md:flex-row items-start md:items-center gap-3">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>

          {success && (
            <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
              <span>✅</span>
              <span>Profile updated successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



function InputField({
  label,
  name,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const hasError = Boolean(error);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-gray-50 dark:bg-slate-800/60 ${
          hasError
            ? "border-red-400 focus:ring-2 focus:ring-red-400/60"
            : "border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400/70"
        }`}
      />
      {hasError && (
        <span className="text-[11px] text-red-500">{error}</span>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}) {
  const hasError = Boolean(error);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-gray-50 dark:bg-slate-800/60 ${
          hasError
            ? "border-red-400 focus:ring-2 focus:ring-red-400/60"
            : "border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400/70"
        }`}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {hasError && (
        <span className="text-[11px] text-red-500">{error}</span>
      )}
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400/90">
      {title}
    </h2>
  );
}

function BMISuggestions({
  bmi,
  bmiCategory,
  bmiTip,
}: {
  bmi: number | null;
  bmiCategory: string;
  bmiTip: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-4 text-sm space-y-2">
      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
        AI Insight · BMI
      </p>
      {bmi ? (
        <>
          <p className="text-lg font-semibold">
            BMI: {bmi.toFixed(1)}{" "}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
              ({bmiCategory})
            </span>
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-200">{bmiTip}</p>
        </>
      ) : (
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Enter your height and weight to see your BMI and quick guidance.
        </p>
      )}
    </div>
  );
}

function AISummaryCard({
  data,
  activityTip,
}: {
  data: ProfileData;
  activityTip: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 py-4 text-sm space-y-2">
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
        AI Summary
      </p>
      <p className="text-xs text-gray-700 dark:text-gray-200">
        Based on your goal{" "}
        <span className="font-semibold">{data.goal || "…"}</span> and
        activity level, Nutraxia will generate a daily routine with diet,
        movement, and reminders tailored to you.
      </p>
      {activityTip && (
        <p className="text-xs text-emerald-600 dark:text-emerald-300">
          Tip: {activityTip}
        </p>
      )}
      {!data.goal && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Choose a clear goal to get more focused suggestions.
        </p>
      )}
    </div>
  );
}
