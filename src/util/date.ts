export function isDayAvailable(day: number): boolean {
  return true;
  // const now = new Date();

  // // If not December, all days are available
  // if (now.getMonth() !== 11) {
  //   return true;
  // }

  // // Get current date in EST timezone
  // const estFormatter = new Intl.DateTimeFormat("en-US", {
  //   timeZone: "America/New_York",
  //   year: "numeric",
  //   month: "numeric",
  //   day: "numeric",
  // });

  // const estDateParts = estFormatter.formatToParts(now);
  // const estDay = parseInt(
  //   estDateParts.find((part) => part.type === "day")?.value || "0"
  // );

  // // Day is available if current EST date >= day
  // return estDay >= day;
}
