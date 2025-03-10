// pages/ActivityLogs.jsx
import React, { useEffect } from 'react';
import BackButton from './components/BackButton';

function ActivityLogs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const styles = `
    .logs-container {
      width: 100%;
      padding: 20px;
      max-width: 960px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="main-container">
        <div className="content-wrapper">
          <div className="logs-container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: '20px',
                gap: '16px',
              }}
            >
              <BackButton onClick={() => window.history.back()} />
              <h2 style={{ margin: 0 }}>Activity Logs</h2>
            </div>
            {/* Add your logs content here */}
            <div>Activity Logs content coming soon...</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityLogs;