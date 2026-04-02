import GamificationProfile from "@/models/GamificationProfile";

const DIFFICULTY_XP: Record<string, number> = {
  easy: 10,
  medium: 15,
  hard: 25,
};

export function calculateLevel(totalXp: number) {
  return Math.max(1, Math.floor(Math.sqrt(totalXp / 100)) + 1);
}

export async function awardXp(userId: string, amount: number) {
  const profile = await GamificationProfile.findOneAndUpdate(
    { userId },
    { $inc: { totalXp: amount } },
    { upsert: true, new: true },
  );

  const nextLevel = calculateLevel(profile.totalXp);
  if (profile.level !== nextLevel) {
    profile.level = nextLevel;
    await profile.save();
  }

  return profile;
}

export function xpForDifficulty(difficulty: string) {
  return DIFFICULTY_XP[difficulty] || 10;
}
