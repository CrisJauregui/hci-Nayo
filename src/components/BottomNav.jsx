import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

function IconAlarm() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function IconAdd() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const pathname = location?.pathname ?? '';
  const onAlarmPage = pathname.startsWith('/alarm/');

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main menu">
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <span className="bottom-nav-icon"><IconAlarm /></span>
        <span className="bottom-nav-label">Alarms</span>
      </NavLink>
      <NavLink
        to="/alarm/new"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive || onAlarmPage ? 'active' : ''}`
        }
      >
        <span className="bottom-nav-icon"><IconAdd /></span>
        <span className="bottom-nav-label">New alarm</span>
      </NavLink>
    </nav>
  );
}
