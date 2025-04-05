import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button';
import Input from './components/Input';
import { validateEmail, validateRequired } from '../utils/validators';

// RecipientItem component remains unchanged for brevity
const RecipientItem = ({ item, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (item.isAdd) {
    return (
      <>
        <p style={{ marginBottom: '10px' }}>
          Select any following recipient below to edit.
        </p>
        <li style={{ width: '100%', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            type="primary"
            onClick={() => onEdit(null)}
            width="100%"
            height="100px"
            fontSize="2rem"
            style={{ fontWeight: 'bold' }}
          >
            + Add Recipient
          </Button>
        </li>
      </>
    );
  }

  return (
    <li
      onClick={() => onEdit(item)}
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
      {item.image ? (
        <img
          src={item.image}
          alt={`${item.name}'s profile`}
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
        <div style={{ width: 'var(--global-input-height)', height: 'var(--global-input-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '50%', height: '50%', fill: 'var(--elevation-2)' }}>
            <path d="M14 23a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1 7 7 0 1 1 14 0ZM7 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm17-1v8a5 5 0 0 1-5 5h-4.526a9.064 9.064 0 0 0-3.839-3.227 6 6 0 0 0-6.614-9.982C4.133 2.133 6.315 0 9 0h10a5 5 0 0 1 5 5Zm-4 10a1 1 0 0 0-1-1h-3.5a1 1 0 1 0 0 2H19a1 1 0 0 0 1-1Z" />
          </svg>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', gap: '12px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>{item.name}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>{item.title}</span>
      </div>
    </li>
  );
};

function Recipient() {
  const [recipients, setRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', title: '', image: '' });
  const [errors, setErrors] = useState({ name: '', email: '', title: '', image: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipients');
      if (!response.ok) throw new Error('Failed to fetch recipients');
      const data = await response.json();
      setRecipients(data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const filteredRecipients = recipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listItems = [
    { id: 'add', name: 'Add Recipient', isAdd: true },
    ...filteredRecipients.map((prof) => ({ ...prof, isAdd: false })),
  ];

  const handleEdit = (item) => {
    if (item === null || item.isAdd) {
      setFormData({ id: null, name: '', email: '', title: '', image: '' });
    } else {
      setFormData({ id: item.id, name: item.name, email: item.email, title: item.title, image: item.image || '' });
    }
    setShowForm(true);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {
      name: validateRequired(formData.name, 'Name').error,
      email: validateEmail(formData.email).error,
      title: validateRequired(formData.title, 'Title').error,
      image: '',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const url = formData.id ? `http://localhost:5000/api/recipients/${formData.id}` : 'http://localhost:5000/api/recipients';
      const method = formData.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name, title: formData.title, image: formData.image || null }),
      });
      if (response.ok) {
        await fetchRecipients();
        setFormData({ id: null, name: '', email: '', title: '', image: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setErrors((prev) => ({ ...prev, email: errorData.error }));
      }
    } catch (error) {
      console.error('Error saving recipient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipients/${formData.id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchRecipients();
        setFormData({ id: null, name: '', email: '', title: '', image: '' });
        setShowForm(false);
      } else {
        console.error('Failed to delete recipient');
      }
    } catch (error) {
      console.error('Error deleting recipient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ id: null, name: '', email: '', title: '', image: '' });
    setShowForm(false);
  };

  const styles = `
    .action-button { display: flex; justify-content: space-between; gap: 10px; margin-top: 20px; }
    .header-container { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 50px; height: 100px; }
    .title-container { display: flex; align-items: center; gap: 16px; }
    .search-bar { 
      width: 400px; 
      height: 100px; 
    }
    /* Override Input component styles for search bar */
    .search-bar.input-field {
      height: 100px;
      width: 400px;
      padding: 10px 20px; /* Adjust padding for better text alignment */
      font-size: 1.5rem; /* Adjust font size to fit the new height */
    }
  `;

  return (
    <div className="main-container-two">
      <div className="content-wrapper">
        <style>{styles}</style>
        <div className="header-container">
          <div className="title-container">
            <BackButton onClick={showForm ? handleCancel : () => window.history.back()} />
            <h2 style={{ margin: 0 }}>
              {!showForm ? 'Recipients' : (formData.id ? 'Edit Recipient' : 'Add Recipient')}
            </h2>
          </div>
          {!showForm && (
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          )}
        </div>
        {showForm ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>
              {formData.id ? 'Edit the recipient details below.' : 'Please fill up the form below to add a new recipient.'}
            </p>
            <Input placeholder="Name" value={formData.name} onChange={handleChange('name')} emailError={errors.name} />
            {errors.name && <p className="error-message" aria-live="polite">{errors.name}</p>}
            <Input placeholder="Email Address" value={formData.email} onChange={handleChange('email')} emailError={errors.email} />
            {errors.email && <p className="error-message" aria-live="polite">{errors.email}</p>}
            <Input placeholder="Title" value={formData.title} onChange={handleChange('title')} emailError={errors.title} />
            {errors.title && <p className="error-message" aria-live="polite">{errors.title}</p>}
            <Input placeholder="Image URL (optional)" value={formData.image} onChange={handleChange('image')} emailError={errors.image} />
            {errors.image && <p className="error-message" aria-live="polite">{errors.image}</p>}
            <div className="action-button">
              {formData.id && <Button type="secondary" onClick={handleDelete} disabled={loading}>DELETE</Button>}
              <Button type="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'SAVING...' : 'CONFIRM'}</Button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', width: '100%' }}>
              {listItems.map((item) => (
                <RecipientItem key={item.id} item={item} onEdit={handleEdit} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipient;