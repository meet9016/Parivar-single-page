/**
 * Utility to convert decimal hours (e.g. 3.75, 1.25, 2.5, 15) into human-readable "Xh Ymin" format
 * Example: 3.75 -> "3h 45min", 1.25 -> "1h 15min", 2.5 -> "2h 30min", 15 -> "15h", 0 -> "0h"
 */
export const formatHoursToHMin = (decimalHours: number | string | undefined | null): string => {
  if (decimalHours === undefined || decimalHours === null || decimalHours === "") return "0h";
  const num = Number(decimalHours);
  if (isNaN(num) || num <= 0) return "0h";

  const totalMinutes = Math.round(num * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};
