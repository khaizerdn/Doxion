import React, { useState, useEffect } from 'react';
import BackButton from './components/BackButton';
import Input from './components/Input';
import useKeyboardPadding from '../utils/useKeyboardPadding';

// Utility function to format date without seconds
const formatDateTime = (dateString) => {
  if (!dateString) return 'Not received';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function ActivityLogs() {
  useKeyboardPadding('.main-container-two');
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/activitylogs');
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      const data = await response.json();
      // Sort logs by most recent date (date_received or created_at) in descending order
      const sortedLogs = data.sort((a, b) => 
        new Date(b.date_received || b.created_at) - new Date(a.date_received || a.created_at)
      );
      setLogs(sortedLogs);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on search term (case-insensitive) for email, recipientEmail, and date
  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    const emailMatch = (log.email || '').toLowerCase().includes(searchLower);
    const recipientEmailMatch = (log.recipientEmail || '').toLowerCase().includes(searchLower);
    const dateString = formatDateTime(log.date_received || log.created_at).toLowerCase();
    const dateMatch = dateString.includes(searchLower);
    return emailMatch || recipientEmailMatch || dateMatch;
  });

  const handleLogClick = (log) => setSelectedLog(log);
  const closeOverview = () => setSelectedLog(null);
  const isReceived = (log) => !!log.date_received;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const styles = `
    .content-wrapper {
      width: 100%;
    }
    .logs-container {
      width: 100%;
    }
    .header-section {
       display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 50px; height: 100px; 
    }
    .title-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .log-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .log-item {
      display: flex;
      justify-content: space-between;
      height: var(--global-input-height);
      align-items: center;
      padding: 30px;
      margin: 20px 0;
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      cursor: pointer;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    .log-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .log-left {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .log-datetime {
      font-size: var(--font-size-4);
      color: var(--color-muted-dark);
    }
    .log-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: var(--font-size-4);
      color: var(--color-muted-dark);
    }
    .log-status {
      font-size: var(--font-size-4);
      font-weight: bold;
      color: var(--color-muted-dark);
    }
    .overview-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .overview-content {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid #e5e5e5;
    }
    .overview-header {
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }
    .overview-header div {
      font-size: 1rem;
      color: #666;
      line-height: 1.5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .overview-header .label {
      font-weight: 600;
      color: #333;
      margin-right: 8px;
    }
    .overview-body {
      margin-top: 16px;
      font-size: 1rem;
      color: #444;
      line-height: 1.6;
    }
    .overview-body p {
      margin: 8px 0;
      padding: 0;
    }
    .overview-body .label {
      font-weight: 600;
      color: #333;
      margin-right: 8px;
    }
    .overview-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      transition: color 0.2s ease;
    }
    .overview-close:hover {
      color: #333;
    }
    .search-bar { 
      width: 400px; 
      height: 100px; 
    }
    /* Override Input component styles for search bar */
    .search-bar.input-field {
      height: 100px;
      width: 400px;
      padding: 10px 20px; /* Adjust padding for better text alignment */
      font-size: 1.5rem; /* Adjust font size to fit the new height */
    }
  `;

  if (loading) return <div>Loading activity logs...</div>;
  if (error) return <div>Error: {error}. Please try refreshing the page.</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="main-container-two">
        <div className="content-wrapper">
          <div className="logs-container">
            <div className="header-section">
              <div className="title-container">
                <BackButton onClick={() => window.history.back()} />
                <h2 style={{ margin: 0 }}>Activity Logs</h2>
              </div>
              <Input
                placeholder="Search by email or date..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
            </div>
            {filteredLogs.length === 0 ? (
              <p>No activity logs available.</p>
            ) : (
              <ul className="log-list">
                {filteredLogs.map((log) => (
                  <li
                    key={log.id}
                    className="log-item"
                    onClick={() => handleLogClick(log)}
                  >
                    <div className="log-left">
                      <div className="log-datetime">
                        <strong>
                          {formatDateTime(isReceived(log) ? log.date_received : log.created_at)}
                        </strong>
                      </div>
                      <div className="log-details">
                        <div>From: {log.email}</div>
                        <div>To: {log.recipientEmail}</div>
                      </div>
                    </div>
                    <div className="log-status">
                      {isReceived(log) ? 'Received' : 'Sent'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {selectedLog && (
        <div className="overview-modal" onClick={closeOverview}>
          <div className="overview-content" onClick={(e) => e.stopPropagation()}>
            <button className="overview-close" onClick={closeOverview}>
              ×
            </button>
            {isReceived(selectedLog) ? (
              <>
                <div className="overview-header">
                  <div><span className="label">To:</span> {selectedLog.recipientEmail}</div>
                  <div><span className="label">From:</span> {selectedLog.email}</div>
                  <div><span className="label">Received:</span> {formatDateTime(selectedLog.date_received)}</div>
                </div>
                <div className="overview-body">
                  <p><span className="label">Locker:</span> {selectedLog.lockerNumber}</p>
                  <p><span className="label">OTP:</span> {selectedLog.otp}</p>
                  <p><span className="label">Sent:</span> {formatDateTime(selectedLog.created_at)}</p>
                  <p><span className="label">Note:</span> {selectedLog.note || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="overview-header">
                  <div><span className="label">From:</span> {selectedLog.email}</div>
                  <div><span className="label">To:</span> {selectedLog.recipientEmail}</div>
                  <div><span className="label">Sent:</span> {formatDateTime(selectedLog.created_at)}</div>
                </div>
                <div className="overview-body">
                  <p><span className="label">Locker:</span> {selectedLog.lockerNumber}</p>
                  <p><span className="label">OTP:</span> {selectedLog.otp}</p>
                  <p><span className="label">Received:</span> {formatDateTime(selectedLog.date_received)}</p>
                  <p><span className="label">Note:</span> {selectedLog.note || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ActivityLogs;