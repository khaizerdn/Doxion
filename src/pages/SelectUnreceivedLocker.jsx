import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton'; // Adjust path as needed

// LockerIcon component
const LockerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15V18"
      stroke="var(--color-muted-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// LockerItem component
const LockerItem = ({ locker, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      onClick={() => onSelect({ lockerNumber: locker.number })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: 'var(--global-input-height)',
        margin: '10px 0',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'var(--elevation-1)',
        border: '1px solid var(--elevation-3)',
        borderRadius: 'var(--global-border-radius)',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {locker.image ? (
        <img
          src={locker.image}
          alt={`Locker ${locker.number}`}
          style={{
            width: 'var(--global-input-height)',
            height: 'var(--global-input-height)',
            borderRadius: 'var(--global-border-radius)',
            padding: '10px',
            objectFit: 'cover',
            transition: 'filter 0.3s ease',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
        />
      ) : (
        <div
          style={{
            width: 'var(--global-input-height)',
            height: 'var(--global-input-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockerIcon />
        </div>
      )}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '28px',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2',
          }}
        >
          Locker {locker.number}
        </span>
        <span
          style={{
            fontSize: '1.625rem',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2',
          }}
        >
          {locker.assignedTo ? locker.assignedTo.name : 'Unassigned'}
        </span>
        <span
          style={{
            fontSize: '1.375rem',
            color: 'rgba(var(--color-muted-dark-rgb), 0.8)',
            lineHeight: '1.2',
          }}
        >
          {locker.assignedTo ? locker.assignedTo.title : 'No profession'}
        </span>
      </div>
    </li>
  );
};

const SelectUnreceivedLocker = ({ onSelect, onBack }) => {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchUnreceivedLockers();
  }, []);

  const fetchUnreceivedLockers = async () => {
    try {
      setLoading(true);
      const [lockerResponse, activityLogResponse, recipientResponse] = await Promise.all([
        fetch('http://localhost:5000/api/lockers'),
        fetch('http://localhost:5000/api/activitylogs'),
        fetch('http://localhost:5000/api/recipients'),
      ]);
  
      if (!lockerResponse.ok) throw new Error('Failed to fetch lockers');
      if (!activityLogResponse.ok) throw new Error('Failed to fetch activity logs');
      if (!recipientResponse.ok) throw new Error('Failed to fetch recipients');
  
      const [lockerData, activityLogData, recipientData] = await Promise.all([
        lockerResponse.json(),
        activityLogResponse.json(),
        recipientResponse.json(),
      ]);
  
      // Create a map of registered recipients by email for quick lookup
      const recipientMap = new Map(
        recipientData.map((recipient) => [recipient.email, recipient])
      );
  
      // Filter lockers with unreceived activity logs
      const unreceivedLockers = lockerData.filter((locker) => {
        const logs = activityLogData.filter(
          (log) => log.lockerNumber === locker.number && !log.date_received
        );
        return logs.length > 0;
      });
  
      // Map lockers with details, including unregistered recipients
      const lockersWithDetails = unreceivedLockers.map((locker) => {
        const activityLog = activityLogData.find(
          (log) => log.lockerNumber === locker.number && !log.date_received
        );
        if (activityLog) {
          const recipientEmail = activityLog.recipientEmail;
          const recipient = recipientMap.get(recipientEmail);
          return {
            ...locker,
            status: 'Pending',
            assignedTo: recipient
              ? {
                  name: recipient.name,
                  email: recipient.email,
                  title: recipient.title,
                }
              : {
                  name: recipientEmail, // Use email as name for unregistered recipients
                  email: recipientEmail,
                  title: '',
                },
            image: recipient ? recipient.image : null,
          };
        }
        return { ...locker, status: 'Pending', assignedTo: null, image: null };
      });
  
      setLockers(lockersWithDetails);
    } catch (err) {
      console.error('Error fetching unreceived lockers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-container"><div className="content-wrapper">Loading unreceived lockers...</div></div>;
  if (error) return <div className="main-container"><div className="content-wrapper">Error: {error}</div></div>;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            gap: '16px',
          }}
        >
          <BackButton onClick={onBack} />
          <h2 style={{ margin: 0 }}>Select Locker</h2>
        </div>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {lockers.map((locker) => (
              <LockerItem key={locker.id} locker={locker} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectUnreceivedLocker;