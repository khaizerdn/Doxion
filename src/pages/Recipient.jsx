import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recipient.css'; // Import the separated CSS file

function Recipient() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Example recipients array.
  const recipients = [
    { id: 1, name: 'John Doe', role: 'Manager', email: 'john.doe@cvsu.edu.ph', image: 'https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg' },
    { id: 2, name: 'Jane Smith', role: 'Developer', email: 'jane.smith@cvsu.edu.ph', image: 'https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg' },
    { id: 3, name: 'Alice Brown', role: 'Designer', email: 'alice.brown@cvsu.edu.ph', image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' },
    { id: 4, name: 'Bob Johnson', role: 'Tester', email: 'bob.johnson@cvsu.edu.ph', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?cs=srgb&dl=pexels-justin-shaifer-501272-1222271.jpg&fm=jpg' },
    { id: 5, name: 'David Wilson', role: 'Analyst', email: 'david.wilson@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Emma Watson', role: 'HR', email: 'emma.watson@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Liam Smith', role: 'Support', email: 'liam.smith@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Olivia Jones', role: 'Engineer', email: 'olivia.jones@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Noah Brown', role: 'Consultant', email: 'noah.brown@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    { id: 10, name: 'Ava Davis', role: 'Sales', email: 'ava.davis@cvsu.edu.ph', image: 'https://via.placeholder.com/150' },
    // Add more recipients as needed...
  ];

  const filteredRecipients = recipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="form-title">Select Recipient</h2>
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

      {/* Recipient Cards Grid */}
      <div className="recipient-grid">
        {filteredRecipients.map((recipient) => (
          <div
            key={recipient.id}
            className="recipient-card"
            onClick={() => {
              // Save selected email and navigate back
              sessionStorage.setItem("selectedRecipientEmail", recipient.email);
              navigate(-1);
            }}
          >
            <div className="recipient-image">
              <img src={recipient.image} alt={recipient.name} />
            </div>
            <div className="recipient-info">
              <h3>{recipient.name}</h3>
              <p>{recipient.role}</p>
              <p>{recipient.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipient;
