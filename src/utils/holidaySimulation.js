/**
 * Holiday notification — PROTOTYPE SIMULATION ONLY
 *
 * Uses predefined dates to demonstrate the UX. Not a real calendar integration.
 * This module is isolated so it can be replaced with real calendar/holiday API later.
 *
 * Example scenario:
 * - "Today" is simulated as January 20, 2026 at 7:00 PM
 * - "Tomorrow" is January 21, 2026 (treated as the example holiday)
 * - If the user has an alarm scheduled for that day, the notification modal is shown.
 */

const EXAMPLE_DAY_BEFORE = '2026-01-21'; // Day before holiday (Tuesday 7 PM)
const EXAMPLE_HOLIDAY_DATE = '2026-01-22'; // Example holiday (Wednesday — matches default alarm)
const EXAMPLE_NOTIFICATION_HOUR = 19; // 7:00 PM

/**
 * Returns true when the app is in holiday demo mode (e.g. ?holidayDemo=1).
 * Used to switch between real date and simulated date.
 */
export function isHolidaySimulationMode(searchParams) {
  return searchParams.get('holidayDemo') === '1';
}

/**
 * In demo mode: returns a fixed date (day before at 7 PM).
 * Otherwise: returns real now.
 */
export function getSimulatedNow(searchParams) {
  if (!isHolidaySimulationMode(searchParams)) return new Date();
  return new Date(`${EXAMPLE_DAY_BEFORE}T${String(EXAMPLE_NOTIFICATION_HOUR).padStart(2, '0')}:00:00`);
}

/**
 * In demo mode: returns the example holiday date (tomorrow).
 * Otherwise: returns real tomorrow.
 */
export function getSimulatedTomorrow(searchParams) {
  if (!isHolidaySimulationMode(searchParams)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }
  return new Date(EXAMPLE_HOLIDAY_DATE + 'T12:00:00');
}

/**
 * Date string YYYY-MM-DD for "tomorrow" (used for disabledDates and sessionStorage key).
 */
export function getSimulatedTomorrowStr(searchParams) {
  if (!isHolidaySimulationMode(searchParams)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  return EXAMPLE_HOLIDAY_DATE;
}

/**
 * In demo mode: tomorrow is always the example holiday for the purpose of showing the modal.
 * Otherwise: use the real holiday check (from holidays.js).
 */
export function shouldShowHolidayNotification(searchParams, realTomorrow, isRealHoliday) {
  if (isHolidaySimulationMode(searchParams)) return true;
  return isRealHoliday(realTomorrow);
}

/** For UI: label that this is a simulated example */
export const HOLIDAY_SIMULATION_LABEL = 'Example: holiday notification (simulated)';
