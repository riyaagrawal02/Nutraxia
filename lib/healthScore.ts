type HealthScoreInputs = {
  sleepHours: number;
  waterMl: number;
  steps: number;
  calories: number;
  calorieTarget: number;
  habitCompletion: number;
  weeklyWorkouts: number;
  workoutTarget: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function calculateHealthScore(inputs: HealthScoreInputs) {
  const sleepScore = clamp(inputs.sleepHours / 8);
  const waterScore = clamp(inputs.waterMl / 2500);
  const stepsScore = clamp(inputs.steps / 10000);
  const calorieGap = inputs.calorieTarget
    ? Math.abs(inputs.calories - inputs.calorieTarget) / inputs.calorieTarget
    : 1;
  const calorieScore = clamp(1 - calorieGap);
  const habitScore = clamp(inputs.habitCompletion);
  const workoutScore = inputs.workoutTarget
    ? clamp(inputs.weeklyWorkouts / inputs.workoutTarget)
    : 0;

  const score =
    100 *
    (0.2 * sleepScore +
      0.15 * waterScore +
      0.15 * stepsScore +
      0.15 * calorieScore +
      0.2 * habitScore +
      0.15 * workoutScore);

  return Math.round(score);
}
