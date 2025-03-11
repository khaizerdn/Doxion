import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectRecipient = ({ onSelect, onBack }) => {
  const [recipients, setRecipients] = useState([]);
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
      // Fetch all recipients
      const recipientResponse = await fetch('http://localhost:5000/api/recipients');
      if (!recipientResponse.ok) throw new Error('Failed to fetch recipients');
      const recipientData = await recipientResponse.json();

      // Fetch submissions to determine assigned lockers
      const submissionResponse = await fetch('http://localhost:5000/api/submissions');
      if (!submissionResponse.ok) throw new Error('Failed to fetch submissions');
      const submissionData = await submissionResponse.json();

      // Map recipients with assigned lockers from submissions
      const recipientsWithLockers = recipientData.map((recipient) => {
        const submission = submissionData.find((sub) => sub.recipientEmail === recipient.email);
        return {
          ...recipient,
          assignedLocker: submission ? submission.lockerNumber : null,
        };
      });

      setRecipients(recipientsWithLockers);
    } catch (err) {
      console.error('Error fetching recipients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (recipient) => {
    const updateData = { recipientEmail: recipient.email };
    if (recipient.assignedLocker) {
      updateData.lockerNumber = recipient.assignedLocker;
    }
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

  if (loading) {
    return <div>Loading recipients...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          {recipients.map((recipient) => (
            <RecipientItem key={recipient.id} recipient={recipient} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectRecipient;