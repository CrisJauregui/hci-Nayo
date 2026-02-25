import { formatTimeHM } from '../context/AlarmContext';
import './HolidayModal.css';

export default function HolidayModal({ alarm, tomorrowDateStr, onDisable, onKeep }) {
  if (!alarm) return null;

  const timeDisplay = formatTimeHM(alarm.time);
  const dateStr = tomorrowDateStr != null ? tomorrowDateStr : (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="holiday-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="holiday-modal-title">
      <div className="holiday-modal">
        <div className="holiday-modal-icon" aria-hidden>📅</div>
        <h2 id="holiday-modal-title" className="holiday-modal-title">
          Tomorrow is a holiday
        </h2>
        <p className="holiday-modal-text">
          You have an alarm scheduled for {timeDisplay}.
        </p>
        <div className="holiday-modal-actions">
          <button
            type="button"
            className="holiday-modal-btn holiday-modal-btn-disable"
            onClick={() => onDisable(alarm.id, dateStr)}
          >
            Deactivate alarm for that day
          </button>
          <button
            type="button"
            className="holiday-modal-btn holiday-modal-btn-keep"
            onClick={onKeep}
          >
            Keep alarm
          </button>
        </div>
      </div>
    </div>
  );
}
