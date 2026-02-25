import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'alba-alarms';

/** Predefined sounds for ALBA Dock. No custom imports. */
export const SOUND_OPTIONS = [
  { id: 'sea', label: 'Mar suave' },
  { id: 'rain', label: 'Lluvia ligera' },
  { id: 'wind', label: 'Viento natural' },
  { id: 'water', label: 'Agua fluyendo' },
];

export function getSoundLabel(soundId) {
  return SOUND_OPTIONS.find((s) => s.id === soundId)?.label ?? SOUND_OPTIONS[0].label;
}

const defaultAlarms = [
  {
    id: '1',
    time: '06:30',
    days: [1, 3], // Monday, Wednesday
    critical: true,
    enabled: true,
    aroma: true,
    sound: 'sea',
    disabledDates: [],
  },
];

function normalizeAlarm(a) {
  const validSounds = SOUND_OPTIONS.map((s) => s.id);
  const sound = validSounds.includes(a.sound) ? a.sound : 'sea';
  return {
    ...a,
    aroma: a.aroma !== false,
    sound,
    disabledDates: Array.isArray(a.disabledDates) ? a.disabledDates : [],
  };
}

function loadAlarms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : defaultAlarms;
      return list.map(normalizeAlarm);
    }
  } catch (_) {}
  return defaultAlarms;
}

function saveAlarms(alarms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
}

const AlarmContext = createContext(null);

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState(loadAlarms);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const addAlarm = useCallback((alarm) => {
    const newAlarm = normalizeAlarm({
      ...alarm,
      id: String(Date.now()),
      aroma: alarm.aroma !== false,
      sound: alarm.sound || 'sea',
      disabledDates: alarm.disabledDates || [],
    });
    setAlarms((prev) => [...prev, newAlarm]);
    return newAlarm;
  }, []);

  const updateAlarm = useCallback((id, updates) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? normalizeAlarm({ ...a, ...updates }) : a))
    );
  }, []);

  const addDisabledDate = useCallback((alarmId, dateStr) => {
    setAlarms((prev) =>
      prev.map((a) => {
        if (a.id !== alarmId) return a;
        const dates = Array.isArray(a.disabledDates) ? a.disabledDates : [];
        return dates.includes(dateStr) ? a : { ...a, disabledDates: [...dates, dateStr] };
      })
    );
  }, []);

  const getAlarmsRingingOnDate = useCallback((date) => {
    const day = date.getDay();
    const dateStr = date.toISOString().slice(0, 10);
    return alarms.filter(
      (a) =>
        a.enabled &&
        Array.isArray(a.days) &&
        a.days.includes(day) &&
        (!Array.isArray(a.disabledDates) || !a.disabledDates.includes(dateStr))
    );
  }, [alarms]);

  const deleteAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  const startRinging = useCallback((alarm) => {
    setRingingAlarm(alarm);
  }, []);

  const stopRinging = useCallback(() => {
    setRingingAlarm(null);
  }, []);

  const value = {
    alarms,
    ringingAlarm,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    addDisabledDate,
    getAlarmsRingingOnDate,
    startRinging,
    stopRinging,
  };

  return (
    <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>
  );
}

export function useAlarms() {
  const ctx = useContext(AlarmContext);
  if (!ctx) throw new Error('useAlarms must be used within AlarmProvider');
  return ctx;
}

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatDays(days) {
  if (!days || days.length === 0) return 'Never';
  if (days.length === 7) return 'Every day';
  return days
    .sort((a, b) => a - b)
    .map((d) => DAY_NAMES[d])
    .join(', ');
}

export function formatTimeHM(timeStr) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  const period = h >= 12 ? 'p.m.' : 'a.m.';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
