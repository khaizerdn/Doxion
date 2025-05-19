import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Splash from './pages/Splash';
import Main from './pages/Main';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminPanel from './pages/AdminPanel';
import AddRecipient from './pages/Recipient';
import Lockers from './pages/Lockers';
import ActivityLogs from './pages/ActivityLogs';
import AdminSettings from './pages/AdminSettings';
import EspDevices from './pages/EspDevices';
import { IdleTimeoutHandler } from './utils/useIdleTimeout';
import GlobalKeyboardProvider from './pages/components/GlobalKeyboardProvider';
import { syncLeds } from './utils/ledSync'; // Import syncLeds

function App() {
  // Sync LEDs on initial app start
  useEffect(() => {
    syncLeds().catch((error) => {
      console.error('Failed to sync LEDs on app start:', error);
    });
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Router>
      <div className="app-container">
        <IdleTimeoutHandler />
        <GlobalKeyboardProvider />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/main" element={<Main />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/recipients" element={<AddRecipient />} />
          <Route path="/lockers" element={<Lockers />} />
          <Route path="/activitylogs" element={<ActivityLogs />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/esp-devices" element={<EspDevices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;