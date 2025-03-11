import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button';
import Input from './components/Input';
import { validateEmail, validateRequired } from '../utils/validators';

const RecipientItem = ({ item, onSelect, onDelete }) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

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
          + Add New Recipient
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

function AddRecipient() {
  const [recipients, setRecipients] = useState([
    {
      id: 1,
      email: 'cc.khaizer.noguera@cvsu.edu.ph',
      name: 'Engr. Khaizer Noguera',
      title: 'Recipient',
      image: null,
    },
    {
      id: 2,
      email: 'cc.marklawrence.lindo@cvsu.edu.ph',
      name: 'Engr. Mark Lawrence Lindo',
      title: 'OJT Coordinator',
      image: null,
    },
    {
      id: 3,
      email: 'cc.vhane.alcasura@cvsu.edu.ph',
      name: 'Engr. Vhane Alcasura',
      title: 'Senior Recipient',
      image: null,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    image: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    title: '',
    image: '',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const listItems = [
    { id: 'add', name: 'Add Recipient', isAdd: true },
    ...recipients.map((prof) => ({ ...prof, isAdd: false })),
  ];

  const handleSelect = (item) => {
    if (item.isAdd) {
      setShowForm(true);
    } else {
      console.log(`Selected recipient: ${item.name}`);
      // TODO: Implement edit form or details display
    }
  };

  const handleDelete = (id) => {
    setRecipients((prevRecipients) => prevRecipients.filter((prof) => prof.id !== id));
    console.log(`Deleted recipient with id: ${id}`);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateRequired(formData.name, 'Name').error,
      email: validateEmail(formData.email).error,
      title: validateRequired(formData.title, 'Title').error,
      image: '', // Image is optional
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newRecipient = {
      id: recipients.length + 1,
      ...formData,
    };
    setRecipients((prev) => [...prev, newRecipient]);
    setFormData({ name: '', email: '', title: '', image: '' });
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', title: '', image: '' });
    setShowForm(false);
  };

  const styles = `
    .action-button {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <style>{styles}</style>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            gap: '16px',
          }}
        >
          <BackButton onClick={showForm ? handleCancel : () => window.history.back()} />
          <h2 style={{ margin: 0 }}>Add Recipient</h2>
        </div>
        {showForm ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>
              Please fill up the form below to add a new recipient.
            </p>
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={handleChange('name')}
              emailError={errors.name}
            />
            {errors.name && (
              <p className="error-message" aria-live="polite">{errors.name}</p>
            )}

            <Input
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange('email')}
              emailError={errors.email}
            />
            {errors.email && (
              <p className="error-message" aria-live="polite">{errors.email}</p>
            )}

            <Input
              placeholder="Title"
              value={formData.title}
              onChange={handleChange('title')}
              emailError={errors.title}
            />
            {errors.title && (
              <p className="error-message" aria-live="polite">{errors.title}</p>
            )}

            <Input
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={handleChange('image')}
              emailError={errors.image}
            />
            {errors.image && (
              <p className="error-message" aria-live="polite">{errors.image}</p>
            )}

            <div className="action-button">
              <Button type="secondary" onClick={handleCancel}>
                CANCEL
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                SUBMIT
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
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
                <RecipientItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddRecipient;