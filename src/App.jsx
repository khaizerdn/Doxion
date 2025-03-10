import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Splash from './pages/Splash';
import Main from './pages/Main';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminPanel from './pages/AdminPanel';
import AddProfessor from './pages/AddProfessor';
import AddLocker from './pages/AddLocker';
import ActivityLogs from './pages/ActivityLogs'; // New import
import { IdleTimeoutHandler } from './utils/useIdleTimeout';

function App() {
  return (
    <Router>
      <div className="app-container">
        <IdleTimeoutHandler />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/main" element={<Main />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/addprofessor" element={<AddProfessor />} />
          <Route path="/addlocker" element={<AddLocker />} />
          <Route path="/activitylogs" element={<ActivityLogs />} /> {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;