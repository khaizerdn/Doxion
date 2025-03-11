import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button'; // Import the Button component

const ProfessorItem = ({ item, onSelect, onDelete }) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false); // Add hover state for delete button

  if (item.isAdd) {
    return (
      <li
        style={{
          width: '100%',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          type="primary"
          onClick={() => onSelect(item)}
          width="100%"
          height="100px"
          fontSize="2rem"
          style={{
            fontWeight: 'bold',
          }}
        >
          + Add New Professor
        </Button>
      </li>
    );
  }

  return (
    <li
      style={{
        position: 'relative',
        width: '100%',
        height: 'var(--global-input-height)',
        margin: '10px 0',
        backgroundColor: 'var(--elevation-1)',
        border: '1px solid var(--elevation-3)',
        borderRadius: 'var(--global-border-radius)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        onClick={() => onSelect(item)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={`${item.name}'s profile`}
            style={{
              width: 'var(--global-input-height)',
              height: 'var(--global-input-height)',
              objectFit: 'cover',
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
                fill: 'var(--color-primary-dark)', // Updated to match previous correction
              }}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
            padding: '28px',
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
            {item.name}
          </span>
          <span
            style={{
              fontSize: '1.625rem',
              textAlign: 'left',
              color: 'var(--color-muted-dark)',
              lineHeight: '1.2',
            }}
          >
            {item.title}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        onMouseEnter={() => setIsDeleteHovered(true)}
        onMouseLeave={() => setIsDeleteHovered(false)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          backgroundColor: isDeleteHovered ? '#6e6e6e' : 'var(--color-muted-dark)',
          color: 'var(--color-muted-light)',
          fontSize: '1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s',
          padding: '0',
        }}
        aria-label={`Delete ${item.name}`}
      >
        X
      </button>
    </li>
  );
};

function AddProfessor() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [professors, setProfessors] = useState([
    {
      id: 1,
      email: 'prof1@example.com',
      name: 'Prof One',
      title: 'Professor',
      image: null,
    },
    {
      id: 2,
      email: 'prof2@example.com',
      name: 'Prof Two',
      title: 'Associate Professor',
      image: null,
    },
  ]);

  const listItems = [
    { id: 'add', name: 'Add Professor', isAdd: true },
    ...professors.map((prof) => ({ ...prof, isAdd: false })),
  ];

  const handleSelect = (item) => {
    if (item.isAdd) {
      console.log('Add new professor');
      // TODO: Implement form display or navigation for adding a new professor
    } else {
      console.log(`Selected professor: ${item.name}`);
      // TODO: Implement edit form or details display for the selected professor
    }
  };

  const handleDelete = (id) => {
    setProfessors((prevProfessors) => prevProfessors.filter((prof) => prof.id !== id));
    console.log(`Deleted professor with id: ${id}`);
  };

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
          <BackButton onClick={() => window.history.back()} />
          <h2 style={{ margin: 0 }}>Add Professor</h2>
        </div>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {listItems.map((item) => (
              <ProfessorItem
                key={item.id}
                item={item}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddProfessor;