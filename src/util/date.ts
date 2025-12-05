export function isDayAvailable(day: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed (0 = January, 11 = December)

  // If not December, all days are available
  if (currentMonth !== 11) {
    return true;
  }

  // Convert current time to EST
  const estTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const currentDay = estTime.getDate();

  // Day is available if current EST date >= day
  return currentDay >= day;
}
