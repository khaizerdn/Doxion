import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recipient.css'; // Reuse the same CSS

function LockerNumber() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Example locker numbers array.
  const lockers = [
    { id: 1, number: '101' },
    { id: 2, number: '102' },
    { id: 3, number: '103' },
    { id: 4, number: '104' },
    { id: 5, number: '105' },
    { id: 6, number: '106' },
    { id: 7, number: '107' },
    { id: 8, number: '108' },
    { id: 9, number: '109' },
    { id: 10, number: '110' },
    // Add more lockers as needed...
  ];

  // Filter lockers based on the search query.
  const filteredLockers = lockers.filter((locker) =>
    locker.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipient-fullscreen">
      {/* Fixed Back Button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-left"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </div>

      {/* Header: Title and Search Bar */}
      <header className="recipient-header">
        <div className="header-title">
          <h2 className="form-title">Select Locker Number</h2>
        </div>
        <div className="header-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Locker Number Cards Grid */}
      <div className="recipient-grid">
        {filteredLockers.map((locker) => (
          <div
            key={locker.id}
            className="recipient-card"
            style={{ position: 'relative' }}
            onClick={() => {
              // Save selected locker number and navigate back
              sessionStorage.setItem("selectedLockerNumber", locker.number);
              navigate(-1);
            }}
          >
            {/* Image container with a transparent placeholder image to enforce the 3:2 aspect ratio */}
            <div className="recipient-image">

            </div>
            {/* Info container (left empty to mimic the spacing) */}
            <div className="recipient-info"></div>
            {/* Centered overlay showing the locker number */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none' // Allows card clicks to pass through
              }}
            >
              <h3>{locker.number}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LockerNumber;