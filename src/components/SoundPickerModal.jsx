import { SOUND_OPTIONS } from '../context/AlarmContext';
import './SoundPickerModal.css';

export default function SoundPickerModal({ selected, onSelect, onClose }) {
  return (
    <div className="sound-picker-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Select sound">
      <div className="sound-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="sound-picker-title">Seleccionar sonido</h2>
        <ul className="sound-picker-list" role="listbox">
          {SOUND_OPTIONS.map((opt) => (
            <li
              key={opt.id}
              role="option"
              aria-selected={selected === opt.id}
              className={`sound-picker-item ${selected === opt.id ? 'selected' : ''}`}
              onClick={() => onSelect(opt.id)}
            >
              <span className="sound-picker-check">{selected === opt.id ? '✓' : ''}</span>
              <span className="sound-picker-label">{opt.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
