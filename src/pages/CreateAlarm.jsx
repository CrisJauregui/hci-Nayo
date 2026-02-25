import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAlarms, DAY_LABELS, getSoundLabel } from '../context/AlarmContext';
import SoundPickerModal from '../components/SoundPickerModal';
import './CreateAlarm.css';

export default function CreateAlarm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { alarms, addAlarm, updateAlarm, deleteAlarm } = useAlarms();
  const isEdit = id && id !== 'new';

  const existing = isEdit ? alarms.find((a) => String(a.id) === String(id)) : state?.alarm;

  const [time, setTime] = useState(() =>
    existing?.time && /^\d{1,2}:\d{2}$/.test(existing.time) ? existing.time : '06:30'
  );
  const [days, setDays] = useState(() =>
    Array.isArray(existing?.days) && existing.days.length > 0
      ? [...existing.days]
      : isEdit
        ? [1, 3]
        : []
  );
  const [aroma, setAroma] = useState(() => existing?.aroma !== false);
  const [sound, setSound] = useState(() => existing?.sound || 'sea');
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  useEffect(() => {
    if (isEdit && !existing) {
      navigate('/', { replace: true });
      return;
    }
    if (existing) {
      setTime(existing.time && /^\d{1,2}:\d{2}$/.test(existing.time) ? existing.time : '06:30');
      setDays(Array.isArray(existing.days) && existing.days.length > 0 ? [...existing.days] : (isEdit ? [1, 3] : []));
      setAroma(existing.aroma !== false);
      setSound(existing.sound || 'sea');
    }
  }, [existing, isEdit, navigate]);

  const toggleDay = (dayIndex) => {
    setDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b)
    );
  };

  const [hour, minute] = (time || '06:30').split(':').map((n) => parseInt(n, 10) || 0);
  const safeHour = Math.min(23, Math.max(0, isNaN(hour) ? 6 : hour));
  const safeMinute = Math.min(59, Math.max(0, isNaN(minute) ? 30 : minute));

  const setHour = (h) => setTime(`${String(Math.min(23, Math.max(0, h))).padStart(2, '0')}:${String(safeMinute).padStart(2, '0')}`);
  const setMinute = (m) => setTime(`${String(safeHour).padStart(2, '0')}:${String(Math.min(59, Math.max(0, m))).padStart(2, '0')}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (days.length === 0) return;
    const payload = { time, days, aroma, sound };
    if (isEdit && id) {
      updateAlarm(String(id), payload);
    } else {
      addAlarm({ ...payload, enabled: true });
    }
    navigate('/', { replace: true });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    if (!id || !isEdit) return;
    if (window.confirm('Delete this alarm?')) {
      deleteAlarm(String(id));
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="create-alarm-screen">
      <header className="create-alarm-header">
        <button
          type="button"
          className="back-btn"
          onClick={handleBack}
          aria-label="Back to alarms"
        >
          ← Back
        </button>
        <h1 className="create-alarm-title">
          {isEdit ? 'Edit alarm' : 'New alarm'}
        </h1>
      </header>

      <form className="create-alarm-form" onSubmit={handleSubmit}>
        <div className="form-group time-input-wrapper">
          <span className="label">Time</span>
          <div className="time-picker">
            <label className="time-picker-label" htmlFor="alarm-hour">
              <span className="time-picker-label-text">Hour</span>
              <select
                id="alarm-hour"
                value={safeHour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="time-picker-select"
                aria-label="Hour"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
            <span className="time-picker-sep">:</span>
            <label className="time-picker-label" htmlFor="alarm-minute">
              <span className="time-picker-label-text">Minutes</span>
              <select
                id="alarm-minute"
                value={safeMinute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="time-picker-select"
                aria-label="Minutes"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <span className="time-input-hint">Select the time and minutes from the dropdowns</span>
        </div>

        <div className="form-group">
          <span className="label">Days (repeat alarm)</span>
          <p className="days-hint">Tap each day to turn on or off</p>
          <div className="days-row" role="group" aria-label="Select days">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                type="button"
                className={`day-chip ${days.includes(i) ? 'active' : ''}`}
                onClick={() => toggleDay(i)}
                aria-pressed={days.includes(i)}
                aria-label={`${label} ${days.includes(i) ? 'on' : 'off'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {days.length === 0 && (
            <p className="days-warning">Select at least one day</p>
          )}
        </div>

        <div className="form-group">
          <button
            type="button"
            className="sound-row"
            onClick={() => setShowSoundPicker(true)}
            aria-label="Select alarm sound"
          >
            <span className="label">Sonido</span>
            <span className="sound-row-value">{getSoundLabel(sound)}</span>
            <span className="sound-row-chevron">&gt;</span>
          </button>
        </div>

        <div className="form-group aroma-row">
          <span className="label">Aroma</span>
          <label className="toggle-switch" aria-label="Coffee aroma">
            <input
              type="checkbox"
              checked={aroma}
              onChange={(e) => setAroma(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
        {aroma && (
          <p className="aroma-hint">Releases coffee aroma when the alarm sounds</p>
        )}

        <p className="conscious-hint">
          All alarms use conscious confirmation (slide to wake up).
        </p>

        <footer className="create-alarm-footer">
          <button
            type="submit"
            className="btn-save"
            disabled={days.length === 0}
          >
            {isEdit ? 'Save' : 'Add alarm'}
          </button>
          {isEdit && (
            <button
              type="button"
              className="btn-delete-alarm"
              onClick={handleDelete}
              aria-label="Delete alarm"
            >
              Delete alarm
            </button>
          )}
        </footer>
      </form>

      {showSoundPicker && (
        <SoundPickerModal
          selected={sound}
          onSelect={(id) => {
            setSound(id);
            setShowSoundPicker(false);
          }}
          onClose={() => setShowSoundPicker(false)}
        />
      )}
    </div>
  );
}
