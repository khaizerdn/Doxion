// pages/AddLocker.jsx
import React, { useEffect } from 'react';
import BackButton from './components/BackButton';

function AddLocker() {
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
              <h2 style={{ margin: 0 }}>Add Locker</h2>
            </div>
            {/* Add your logs content here */}
            <div>Add locker content coming soon...</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddLocker;