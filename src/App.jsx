import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AlarmList from './pages/AlarmList';
import CreateAlarm from './pages/CreateAlarm';
import AlarmRinging from './pages/AlarmRinging';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AlarmList />} />
        <Route path="alarm/new" element={<CreateAlarm />} />
        <Route path="alarm/:id" element={<CreateAlarm />} />
      </Route>
      <Route path="/ringing" element={<AlarmRinging />} />
    </Routes>
  );
}
