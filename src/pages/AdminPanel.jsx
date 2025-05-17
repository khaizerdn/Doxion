import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackButton from './components/BackButton';
import useKeyboardPadding from '../utils/useKeyboardPadding'; // Import the hook

function AdminPanel() {
  useKeyboardPadding('.main-container-two'); // Apply padding for main-container-two

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const adminStyles = `
    .admin-container {
      width: 100%;
    }
    .admin-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 960px;
    }
    .admin-item {
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      aspect-ratio: 1 / 1;
    }
    .admin-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .admin-icon {
      width: 50%;
      height: 50%;
      margin-bottom: 10%;
      fill: var(--color-primary-dark);
      transition: fill 0.3s ease;
    }
    .admin-item:hover{
      fill: var(--text-accent);
    }
    .admin-text {
      font-size: clamp(1rem, 2vw, 1.625rem);
      font-weight: bold;
      color: var(--color-muted-dark);
      line-height: 1.2;
      text-align: center;
    }
  `;

  const AdminItem = ({ text, to, iconType }) => {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        <li className="admin-item">
          {iconType === 'recipient' ? (
            <svg className="admin-icon" viewBox="0 0 24 24">
              <path d="M14 23a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1 7 7 0 1 1 14 0ZM7 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm17-1v8a5 5 0 0 1-5 5h-4.526a9.064 9.064 0 0 0-3.839-3.227 6 6 0 0 0-6.614-9.982C4.133 2.133 6.315 0 9 0h10a5 5 0 0 1 5 5Zm-4 10a1 1 0 0 0-1-1h-3.5a1 1 0 1 0 0 2H19a1 1 0 0 0 1-1Z" />
            </svg>
          ) : iconType === 'logs' ? (
            <svg className="admin-icon" viewBox="0 0 24 24">
              <path d="M23.793 18a4.977 4.977 0 0 1-1.258 2.105l-2.43 2.43a4.98 4.98 0 0 1-2.106 1.258V19c0-.552.449-1 1-1h4.793ZM24 5v11h-5c-1.654 0-3 1.346-3 3v5H5c-2.757 0-5-2.243-5-5V5c0-2.757 2.243-5 5-5h14c2.757 0 5 2.243 5 5ZM7 17.5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 7 17.5ZM7 12a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 7 12Zm0-5.5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 7 6.5Z" />
            </svg>
          ) : iconType === 'settings' ? (
            <svg className="admin-icon" viewBox="0 0 24 24">
              <path d="M12 12c-3.804 0-5.5-1.696-5.5-5.5S8.196 1 12 1s5.5 1.696 5.5 5.5S15.804 12 12 12zm2.039 2.113a22.678 22.678 0 0 1-1.101 1.665 36.344 36.344 0 0 1 1.002 4.051A.962.962 0 0 1 13 21h-2a.963.963 0 0 1-.94-1.171c.209-1.287.559-2.624.981-3.988a15.062 15.062 0 0 1-1.127-1.724c-4.504.546-6.659 3.024-6.913 7.83A1 1 0 0 0 4 23h16a1.002 1.002 0 0 0 .999-1.053c-.255-4.822-2.425-7.299-6.96-7.835z" />
            </svg>
          ) : (
            <svg className="admin-icon" viewBox="0 0 24 24">
              <path d="M19.683 9.515a.999.999 0 0 0-.709-.633c-.132-.031-3.268-.769-6.974-.769-1.278 0-2.49.088-3.535.205a8.6 8.6 0 0 1-.037-.813C8.428 4.524 9.577 4 11.993 4s3.065.667 3.379 1.821a1.5 1.5 0 0 0 2.895-.785C17.174 1 13.275 1 11.994 1 7.638 1 5.429 3.188 5.429 7.505c0 .453.023.876.068 1.274-.277.057-.442.095-.47.102a1 1 0 0 0-.71.636c-.038.107-.936 2.655-.936 6.039 0 3.413.898 5.937.937 6.042a.999.999 0 0 0 .709.633c.132.032 3.268.769 6.974.769s6.842-.737 6.974-.768a1 1 0 0 0 .71-.637c.038-.106.936-2.655.936-6.039 0-3.413-.898-5.936-.937-6.042ZM13 16.299a1 1 0 1 1-2 0v-1.485a1 1 0 1 1 2 0v1.485Z" />
            </svg>
          )}
          <span className="admin-text">{text}</span>
        </li>
      </Link>
    );
  };

  return (
    <>
      <style>{adminStyles}</style>
      <div className="main-container-two">
        <div className="content-wrapper">
          <div className="admin-container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: '50px',
                gap: '16px',
              }}
            >
              <BackButton onClick={() => window.history.back()} />
              <h2 style={{ margin: 0 }}>Admin Panel</h2>
            </div>
            <div style={{ width: '100%' }}>
              <ul className="admin-list">
                <AdminItem text="Recipients" to="/recipients" iconType="recipient" />
                <AdminItem text="Lockers" to="/lockers" iconType="locker" />
                <AdminItem text="Activity Logs" to="/activitylogs" iconType="logs" />
                <AdminItem text="Set Admin" to="/admin-settings" iconType="settings" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;