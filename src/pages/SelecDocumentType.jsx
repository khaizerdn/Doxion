import React, { useState } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectDocumentType = ({ onSelect, onBack }) => {
  // Predefined list of document types
  const documentTypes = [
    { id: 1, name: 'OJT' },
    { id: 2, name: 'Thesis' },
    { id: 3, name: 'Activity' },
    { id: 4, name: 'Quiz' },
    { id: 5, name: 'Assignment' },
    { id: 6, name: 'Other' },
  ];

  const handleSelect = (type) => {
    onSelect({ documentType: type.name });
  };

  const DocumentTypeItem = ({ type }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <li
        onClick={() => handleSelect(type)}
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
          display: 'flex',
          alignItems: 'center',
          padding: '30px',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-size-3)',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2',
          }}
        >
          {type.name}
        </span>
      </li>
    );
  };

  return (
    <div style={{ width: '100%' }}>
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
        <h2 style={{ margin: 0 }}>Select Document Type</h2>
      </div>
      <div style={{ width: '100%' }}>
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
          {documentTypes.map((type) => (
            <DocumentTypeItem key={type.id} type={type} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectDocumentType;