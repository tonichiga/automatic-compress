export function percentageToRange(percentage, minValue = 2, maxValue = 32) {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

  return minValue + (percentage / 100) * (maxValue - minValue);
}
