// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SplashPage from './pages/SplashPage';
import MainPage from './pages/MainPage';
import { IdleTimeoutHandler } from './utils/useIdleTimeout'; // Import only the handler

function App() {
  return (
    <Router>
      <div className="app-container">
        <IdleTimeoutHandler /> {/* Use the wrapper component */}
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;