import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectRecipient = ({ onSelect, onBack }) => {
  const [recipientItems, setRecipientItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('SelectRecipient mounted, resetting scroll to top');
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      // Fetch activity logs to get recipient emails and their assigned lockers
      const activityLogResponse = await fetch('http://127.0.0.1:5000/api/activitylogs');
      if (!activityLogResponse.ok) throw new Error('Failed to fetch activity logs');
      const activityLogData = await activityLogResponse.json();
  
      // Fetch registered recipients
      const recipientResponse = await fetch('http://127.0.0.1:5000/api/recipients');
      if (!recipientResponse.ok) throw new Error('Failed to fetch recipients');
      const recipientData = await recipientResponse.json();
  
      // Create a map of registered recipients by email for quick lookup
      const recipientMap = new Map(
        recipientData.map((recipient) => [recipient.email, recipient])
      );
  
      // Filter activity logs to only unreceived (occupied) logs
      const unreceivedLogs = activityLogData.filter((log) => !log.date_received);
  
      // Create a map of recipient emails to their assigned lockers (unreceived only)
      const lockerAssignments = new Map();
      unreceivedLogs.forEach((log) => {
        const email = log.recipientEmail;
        if (!lockerAssignments.has(email)) {
          lockerAssignments.set(email, new Set());
        }
        lockerAssignments.get(email).add(log.lockerNumber);
      });
  
      // Create items list, separating assigned and unassigned recipients
      const assignedItems = [];
      const unassignedItems = [];
  
      // Process all registered recipients
      recipientData.forEach((recipient) => {
        const assignedLockers = lockerAssignments.get(recipient.email) || new Set();
        if (assignedLockers.size > 0) {
          // Add an item for each assigned locker to assignedItems
          assignedLockers.forEach((locker) => {
            assignedItems.push({
              ...recipient,
              assignedLocker: locker,
            });
          });
        } else {
          // Add to unassignedItems if no lockers
          unassignedItems.push({
            ...recipient,
            assignedLocker: null,
          });
        }
      });
  
      // Process unregistered recipients from unreceived activity logs
      const unregisteredEmails = [...new Set(unreceivedLogs.map((log) => log.recipientEmail))].filter(
        (email) => !recipientMap.has(email)
      );
      unregisteredEmails.forEach((email) => {
        const assignedLockers = lockerAssignments.get(email) || new Set();
        if (assignedLockers.size > 0) {
          // Add an item for each assigned locker to assignedItems
          assignedLockers.forEach((locker) => {
            assignedItems.push({
              id: `temp-${email}`,
              email,
              name: email,
              title: 'Unregistered Recipient',
              image: null,
              assignedLocker: locker,
            });
          });
        } else {
          // Add to unassignedItems if no lockers (unlikely but included)
          unassignedItems.push({
            id: `temp-${email}`,
            email,
            name: email,
            title: 'Unregistered Recipient',
            image: null,
            assignedLocker: null,
          });
        }
      });
  
      // Combine lists: assigned recipients first, then unassigned
      const items = [...assignedItems, ...unassignedItems];
  
      setRecipientItems(items.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Error fetching recipients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    const updateData = { 
      recipientEmail: item.email,
      name: item.name, // Pass the name for display
      lockerNumber: item.assignedLocker || '', // Use the specific locker or empty string if none
    };
    onSelect(updateData);
  };

  const RecipientItem = ({ recipient }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <li
        onClick={() => handleSelect(recipient)}
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
        {recipient.image ? (
          <img
            src={recipient.image}
            alt={`${recipient.name}'s profile`}
            style={{
              width: 'var(--global-input-height)',
              height: 'var(--global-input-height)',
              padding: '10px',
              objectFit: 'cover',
              borderRadius: 'var(--global-border-radius)',
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{
                width: '50%',
                height: '50%',
                fill: 'var(--elevation-2)',
              }}
            >
              <path d="M14 23a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1 7 7 0 1 1 14 0ZM7 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm17-1v8a5 5 0 0 1-5 5h-4.526a9.064 9.064 0 0 0-3.839-3.227 6 6 0 0 0-6.614-9.982C4.133 2.133 6.315 0 9 0h10a5 5 0 0 1 5 5Zm-4 10a1 1 0 0 0-1-1h-3.5a1 1 0 1 0 0 2H19a1 1 0 0 0 1-1Z" />
            </svg>
          </div>
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '2rem',
              textAlign: 'left',
              color: 'var(--color-muted-dark)',
              lineHeight: '1.2',
            }}
          >
            {recipient.name}
          </span>
          <span
            style={{
              fontSize: '1.625rem',
              textAlign: 'left',
              color: 'var(--color-muted-dark)',
              lineHeight: '1.2',
            }}
          >
            {recipient.title}
          </span>
          <span
            style={{
              fontSize: '1.375rem',
              textAlign: 'left',
              color: 'rgba(var(--color-muted-dark-rgb), 0.8)',
              lineHeight: '1.2',
            }}
          >
            Locker: {recipient.assignedLocker || 'None'}
          </span>
        </div>
      </li>
    );
  };

  if (loading) return <div>Loading recipients...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="select-recipient" style={{ width: '100%' }}>
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
        <h2 style={{ margin: 0 }}>Select Recipient</h2>
      </div>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {recipientItems.map((item, index) => (
            <RecipientItem key={`${item.id}-${item.assignedLocker || 'none'}-${index}`} recipient={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectRecipient;