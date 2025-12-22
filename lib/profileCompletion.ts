export function calculateProfileCompletion(profile: any) {
  if (!profile) return 0;

  const fields = [
    profile.age,
    profile.gender,
    profile.height,
    profile.weight,
    profile.activity,
    profile.goal,
    profile.avatarUrl,
  ];

  const filled = fields.filter(Boolean).length;
  const total = fields.length;

  return Math.round((filled / total) * 100);
}
