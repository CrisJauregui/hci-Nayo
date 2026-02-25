import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAlarms, formatDays, formatTimeHM } from '../context/AlarmContext';
import { getTomorrow, getTomorrowStr, isHoliday } from '../utils/holidays';
import {
  isHolidaySimulationMode,
  getSimulatedNow,
  getSimulatedTomorrow,
  getSimulatedTomorrowStr,
  shouldShowHolidayNotification,
  HOLIDAY_SIMULATION_LABEL,
} from '../utils/holidaySimulation';
import HolidayModal from '../components/HolidayModal';
import './AlarmList.css';

const HOLIDAY_MODAL_KEY = 'alba-holiday-modal-';

export default function AlarmList() {
  const navigate = useNavigate();
  const { alarms, toggleAlarm, startRinging, getAlarmsRingingOnDate, addDisabledDate } = useAlarms();
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayAlarm, setHolidayAlarm] = useState(null);
  const [searchParams] = useSearchParams();
  const testHoliday = searchParams.get('testHoliday') === '1';
  const holidayDemo = isHolidaySimulationMode(searchParams);

  useEffect(() => {
    if (testHoliday) {
      const firstEnabled = alarms.find((a) => a.enabled);
      if (firstEnabled) {
        setHolidayAlarm(firstEnabled);
        setShowHolidayModal(true);
      }
      return;
    }

    const now = holidayDemo ? getSimulatedNow(searchParams) : new Date();
    const tomorrow = holidayDemo ? getSimulatedTomorrow(searchParams) : getTomorrow();
    const tomorrowStr = holidayDemo ? getSimulatedTomorrowStr(searchParams) : getTomorrowStr();

    if (now.getHours() < 19) return;
    if (!shouldShowHolidayNotification(searchParams, tomorrow, isHoliday)) return;

    const ringing = getAlarmsRingingOnDate(tomorrow);
    if (ringing.length === 0) return;

    const key = HOLIDAY_MODAL_KEY + tomorrowStr;
    if (sessionStorage.getItem(key)) return;

    setHolidayAlarm(ringing[0]);
    setShowHolidayModal(true);
  }, [getAlarmsRingingOnDate, alarms, testHoliday, holidayDemo, searchParams]);

  const handleHolidayDisable = (alarmId, dateStr) => {
    addDisabledDate(alarmId, dateStr);
    if (!testHoliday) sessionStorage.setItem(HOLIDAY_MODAL_KEY + dateStr, '1');
    setShowHolidayModal(false);
    setHolidayAlarm(null);
  };

  const handleHolidayKeep = () => {
    const tomorrowStr = holidayDemo ? getSimulatedTomorrowStr(searchParams) : getTomorrowStr();
    if (!testHoliday) sessionStorage.setItem(HOLIDAY_MODAL_KEY + tomorrowStr, '1');
    setShowHolidayModal(false);
    setHolidayAlarm(null);
  };

  const handleEdit = (alarm) => {
    navigate(`/alarm/${alarm.id}`, { state: { alarm } });
  };

  const handleTestRinging = (alarm) => {
    startRinging(alarm);
    navigate('/ringing');
  };

  return (
    <div className="alarm-list-screen">
      {showHolidayModal && (
        <HolidayModal
          alarm={holidayAlarm}
          tomorrowDateStr={holidayDemo ? getSimulatedTomorrowStr(searchParams) : undefined}
          onDisable={handleHolidayDisable}
          onKeep={handleHolidayKeep}
        />
      )}
      <header className="alarm-list-header">
        <h1 className="alarm-list-title">Alarms</h1>
      </header>

      <ul className="alarm-list" aria-label="Alarm list">
        {alarms.length === 0 ? (
          <li className="alarm-list-empty">
            <p className="alarm-list-empty-text">No alarms yet</p>
            <p className="alarm-list-empty-hint">Add one to wake up consciously</p>
          </li>
        ) : alarms.map((alarm) => (
          <li key={alarm.id} className="alarm-card">
            <button
              type="button"
              className="alarm-card-content"
              onClick={() => handleEdit(alarm)}
              aria-label={`Edit alarm ${formatTimeHM(alarm.time)}`}
            >
              <span className="alarm-card-time">{formatTimeHM(alarm.time)}</span>
              <span className="alarm-card-days">{formatDays(alarm.days)}</span>
            </button>
            <div className="alarm-card-actions">
              <button
                type="button"
                className="alarm-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(alarm);
                }}
                aria-label="Edit alarm"
              >
                Edit
              </button>
              <label className="toggle-switch" aria-label="Turn alarm on or off">
                <input
                  type="checkbox"
                  checked={alarm.enabled}
                  onChange={() => toggleAlarm(alarm.id)}
                />
                <span className="toggle-slider" />
              </label>
              <button
                type="button"
                className="test-alarm-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestRinging(alarm);
                }}
                aria-label="Probar esta alarma"
              >
                Test
              </button>
            </div>
          </li>
        ))}
      </ul>

      {alarms.length > 0 && (
        <p className="alarm-list-demo-hint">
          <a
            href="/?holidayDemo=1"
            className="alarm-list-demo-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/?holidayDemo=1');
            }}
          >
            {HOLIDAY_SIMULATION_LABEL}
          </a>
        </p>
      )}
    </div>
  );
}
