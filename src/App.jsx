// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Splash from './pages/Splash';
import Main from './pages/Main';
import TermsAndConditions from './pages/TermsAndConditions'; // Import new page
import { IdleTimeoutHandler } from './utils/useIdleTimeout';

function App() {
  return (
    <Router>
      <div className="app-container">
        <IdleTimeoutHandler />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/main" element={<Main />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} /> {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;