// src/pages/SelectRecipient.jsx
import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectRecipient = ({ onSelect, onBack }) => {
  // Mock recipient list with assigned locker data, aligned with lockers
  const recipients = [
    { 
      id: 1, 
      email: 'john.doe@example.com', 
      name: 'John Doe', 
      title: 'Developer', 
      dept: 'Engineering', 
      assignedLocker: 'L001',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&h=700'
    },
    { 
      id: 2, 
      email: 'jane.smith@example.com', 
      name: 'Jane Smith', 
      title: 'Designer', 
      dept: 'Creative', 
      assignedLocker: 'L002',
      image: 'https://headshots-inc.com/wp-content/uploads/2023/02/Professional-Headshot-Photography-Example-1.jpg'
    },
    { 
      id: 3, 
      email: 'alice.jones@example.com', 
      name: 'Alice Jones', 
      title: 'Researcher', 
      dept: 'Science', 
      assignedLocker: null,
      image: 'https://via.placeholder.com/150'
    }
  ];

  // Reset scroll to top on mount
  useEffect(() => {
    console.log('SelectRecipient mounted, resetting scroll to top');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSelect = (recipient) => {
    const updateData = {};
    updateData.recipientEmail = recipient.email; // Always set email
    if (recipient.assignedLocker) {
      updateData.lockerNumber = recipient.assignedLocker;
    } // Only set lockerNumber if assigned
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
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
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
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
          }}
        />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '20px',
          gap: '12px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '2rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            {recipient.name}
          </span>
          <span style={{ 
            fontSize: '1.625rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            {recipient.title}
          </span>
          <span style={{ 
            fontSize: '1.375rem',
            textAlign: 'left',
            color: 'rgba(var(--color-muted-dark-rgb), 0.8)',
            lineHeight: '1.2'
          }}>
            Locker: {recipient.assignedLocker || 'None'}
          </span>
        </div>
      </li>
    );
  };

  return (
    <div className="select-recipient" style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginBottom: '20px',
        gap: '16px'
      }}>
        <BackButton onClick={onBack} />
        <h2 style={{ margin: 0 }}>Select Recipient</h2>
      </div>
      <div style={{
        width: '100%',
        maxWidth: '800px',
      }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>
          {recipients.map(recipient => (
            <RecipientItem key={recipient.id} recipient={recipient} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectRecipient;