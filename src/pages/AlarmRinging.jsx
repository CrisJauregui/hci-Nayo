import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAlarms, formatTimeHM } from '../context/AlarmContext';
import './AlarmRinging.css';

const SLIDE_DURATION_MS = 2000; // 2 seconds conscious confirmation
const TICK_MS = 50;

export default function AlarmRinging() {
  const navigate = useNavigate();
  const { ringingAlarm, stopRinging } = useAlarms();
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSlide = useCallback(() => {
    if (confirmed) return;
    clearTimer();
    setProgress(0);
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += TICK_MS;
      const next = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(next);
      if (next >= 100) {
        clearTimer();
        setConfirmed(true);
        stopRinging();
      }
    }, TICK_MS);
  }, [confirmed, stopRinging, clearTimer]);

  const endSlide = useCallback(() => {
    if (confirmed) return;
    clearTimer();
    setProgress(0);
  }, [confirmed, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleGoBack = () => {
    clearTimer();
    stopRinging();
    navigate('/');
  };

  // Progressive wake-up sound: 0–5s very soft, 5–20s gradual increase, 20+s stable
  // Base frequency varies slightly by sound type (microvariation to reduce habituation)
  useEffect(() => {
    if (!ringingAlarm || confirmed) return;
    const baseFreq = { sea: 400, rain: 420, wind: 380, water: 440 }[ringingAlarm.sound || 'sea'] ?? 400;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const startTime = ctx.currentTime;

    const playBeep = (gainValue) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = baseFreq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    };

    playBeep(0.03);
    let elapsed = 0;
    const interval = 1200;
    const id = setInterval(() => {
      elapsed += interval / 1000;
      let vol = 0.04;
      if (elapsed < 5) vol = 0.03;
      else if (elapsed < 20) vol = 0.03 + (elapsed - 5) / 15 * 0.06;
      else vol = 0.09;
      playBeep(Math.min(vol, 0.1));
    }, interval);
    return () => clearInterval(id);
  }, [ringingAlarm, confirmed]);

  if (!ringingAlarm) {
    return <Navigate to="/" replace />;
  }

  const timeDisplay = formatTimeHM(ringingAlarm.time);

  return (
    <div className="alarm-ringing-screen">
      <div className="alarm-ringing-dock-line" aria-hidden />
      <div className="alarm-ringing-content">
        <p className="alarm-ringing-greeting">Good morning</p>
        <p className="alarm-ringing-time">{timeDisplay}</p>

        {confirmed ? (
          <div className="slide-result">
            <p className="slide-result-text">Wake-up confirmed</p>
            <button
              type="button"
              className="btn-done"
              onClick={handleGoBack}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="slide-block">
            <p className="slide-instruction">Slide to wake up →</p>
            <div
              className="slide-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Slide for 2 seconds to confirm wake up"
              onPointerDown={startSlide}
              onPointerUp={endSlide}
              onPointerLeave={endSlide}
              onTouchStart={(e) => {
                e.preventDefault();
                startSlide();
              }}
              onTouchEnd={endSlide}
              onTouchCancel={endSlide}
            >
              <div
                className="slide-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
