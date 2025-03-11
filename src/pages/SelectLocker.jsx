// src/pages/SelectLocker.jsx
import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectLocker = ({ onSelect, onBack }) => {
  // Mock locker list with assigned person data, without location
  const lockers = [
    { 
      id: 'L001', 
      number: 'L001', 
      status: 'Available', 
      assignedTo: { name: 'John Doe', email: 'john.doe@example.com', title: 'Developer' },
      image: 'https://www.qu.edu/4aabf2/globalassets/global/media/qu/photography/1_today/z-_-archive-photos-pre-2024/mohammad-elahee-headshot-580x417-2023.jpg'
    },
    { 
      id: 'L002', 
      number: 'L002', 
      status: 'Available', 
      assignedTo: { name: 'Jane Smith', email: 'jane.smith@example.com', title: 'Designer' },
      image: 'https://headshots-inc.com/wp-content/uploads/2023/02/Professional-Headshot-Photography-Example-1.jpg'
    },
    { 
      id: 'L003', 
      number: 'L003', 
      status: 'Occupied', 
      assignedTo: null,
      image: 'https://via.placeholder.com/150'
    }
  ];

  // Reset scroll to top on mount
  useEffect(() => {
    console.log('SelectLocker mounted, resetting scroll to top');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSelect = (locker) => {
    const updateData = {};
    updateData.lockerNumber = locker.number; // Always set lockerNumber
    if (locker.assignedTo) {
      updateData.recipientEmail = locker.assignedTo.email;
    } // Only set recipientEmail if assigned
    onSelect(updateData);
  };

  const LockerItem = ({ locker }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <li
        onClick={() => handleSelect(locker)}
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
          src={locker.image} 
          alt={`Locker ${locker.number}`}
          style={{
            width: 'var(--global-input-height)',
            height: 'var(--global-input-height)',
            objectFit: 'cover',
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
          padding: '28px',
          gap: '12px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '2rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            Locker {locker.number}
          </span>
          <span style={{ 
            fontSize: '1.625rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            {locker.assignedTo ? locker.assignedTo.name : 'Unassigned'}
          </span>
          <span style={{ 
            fontSize: '1.375rem',
            textAlign: 'left',
            color: 'rgba(var(--color-muted-dark-rgb), 0.8)',
            lineHeight: '1.2'
          }}>
            {locker.assignedTo ? locker.assignedTo.title : 'No profession'}
          </span>
        </div>
      </li>
    );
  };

  return (
    <div className="select-locker" style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginBottom: '20px',
        gap: '16px'
      }}>
        <BackButton onClick={onBack} />
        <h2 style={{ margin: 0 }}>Select Locker</h2>
      </div>
      <div style={{
        width: '100%',
        maxWidth: '800px',
      }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>
          {lockers.map(locker => (
            <LockerItem key={locker.id} locker={locker} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectLocker;