/**
 * Festivos para detección (México + algunos internacionales).
 * Formato: 'YYYY-MM-DD' para fechas concretas.
 * La app muestra notificación el día anterior a las 19:00.
 */

const HOLIDAYS = new Set([
  // 2025
  '2025-01-01', // Año nuevo
  '2025-02-03', // Día de la Constitución (lunes)
  '2025-03-17', // Natalicio de Benito Juárez (lunes)
  '2025-05-01', // Día del trabajo
  '2025-09-16', // Día de la Independencia
  '2025-11-03', // Día de Muertos
  '2025-11-17', // Revolución Mexicana (lunes)
  '2025-12-25', // Navidad
  // 2026
  '2026-01-01',
  '2026-02-02',
  '2026-03-16',
  '2026-05-01',
  '2026-09-16',
  '2026-11-02',
  '2026-11-16',
  '2026-12-25',
]);

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

export function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

export function isHoliday(date) {
  return HOLIDAYS.has(toDateStr(date));
}

export function getTomorrowStr() {
  return toDateStr(getTomorrow());
}
