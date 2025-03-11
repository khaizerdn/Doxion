import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button';
import Input from './components/Input';
import { validateRequired } from '../utils/validators';

const LockerItem = ({ item, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (item.isAdd) {
    return (
      <>
        <p style={{ marginBottom: '10px' }}>
          Select any following lockers below to edit.
        </p>
        <li style={{ width: '100%', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            type="primary"
            onClick={() => onEdit(null)} // Null indicates adding a new locker
            width="100%"
            height="100px"
            fontSize="2rem"
            style={{ fontWeight: 'bold' }}
          >
            + Add Locker
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
      <div style={{ width: 'var(--global-input-height)', height: 'var(--global-input-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '50%', height: '50%', fill: 'var(--elevation-2)' }}>
          <path d="M19.683 9.515a.999.999 0 0 0-.709-.633c-.132-.031-3.268-.769-6.974-.769-1.278 0-2.49.088-3.535.205a8.6 8.6 0 0 1-.037-.813C8.428 4.524 9.577 4 11.993 4s3.065.667 3.379 1.821a1.5 1.5 0 0 0 2.895-.785C17.174 1 13.275 1 11.994 1 7.638 1 5.429 3.188 5.429 7.505c0 .453.023.876.068 1.274-.277.057-.442.095-.47.102a1 1 0 0 0-.71.636c-.038.107-.936 2.655-.936 6.039 0 3.413.898 5.937.937 6.042a.999.999 0 0 0 .709.633c.132.032 3.268.769 6.974.769s6.842-.737 6.974-.768a1 1 0 0 0 .71-.637c.038-.106.936-2.655.936-6.039 0-3.413-.898-5.936-.937-6.042ZM13 16.299a1 1 0 1 1-2 0v-1.485a1 1 0 1 1 2 0v1.485Z" />
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', gap: '12px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>Locker {item.number}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>{item.location}</span>
      </div>
    </li>
  );
};

function Lockers() {
  const [lockers, setLockers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, number: '', location: '' });
  const [errors, setErrors] = useState({ number: '', location: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lockers');
      const data = await response.json();
      setLockers(data);
    } catch (error) {
      console.error('Error fetching lockers:', error);
    }
  };

  const listItems = [
    { id: 'add', name: 'Add Locker', isAdd: true },
    ...lockers.map((locker) => ({ ...locker, isAdd: false })),
  ];

  const handleEdit = (item) => {
    if (item === null || item.isAdd) {
      setFormData({ id: null, number: '', location: '' });
    } else {
      setFormData({ id: item.id, number: item.number, location: item.location });
    }
    setShowForm(true);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      number: validateRequired(formData.number, 'Locker Number').error,
      location: validateRequired(formData.location, 'Location').error,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const url = formData.id ? `http://localhost:5000/api/lockers/${formData.id}` : 'http://localhost:5000/api/lockers';
      const method = formData.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: formData.number, location: formData.location }),
      });
      if (response.ok) {
        const updatedLocker = await response.json();
        if (formData.id) {
          setLockers((prev) => prev.map((locker) => (locker.id === formData.id ? updatedLocker : locker)));
        } else {
          setLockers((prev) => [...prev, updatedLocker]);
        }
        setFormData({ id: null, number: '', location: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setErrors((prev) => ({ ...prev, number: errorData.error }));
      }
    } catch (error) {
      console.error('Error saving locker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/lockers/${formData.id}`, { method: 'DELETE' });
      if (response.ok) {
        setLockers((prev) => prev.filter((locker) => locker.id !== formData.id));
        setFormData({ id: null, number: '', location: '' });
        setShowForm(false);
      } else {
        console.error('Failed to delete locker');
      }
    } catch (error) {
      console.error('Error deleting locker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ id: null, number: '', location: '' });
    setShowForm(false);
  };

  const styles = `
    .action-button { display: flex; justify-content: space-between; gap: 10px; margin-top: 20px; }
  `;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <style>{styles}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
          <BackButton onClick={showForm ? handleCancel : () => window.history.back()} />
          <h2 style={{ margin: 0 }}>
            {!showForm ? 'Lockers' : (formData.id ? 'Edit Locker' : 'Add Locker')}
          </h2>
        </div>
        {showForm ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>
              {formData.id ? 'Edit the locker details below.' : 'Please fill up the form below to add a new locker.'}
            </p>
            <Input placeholder="Locker Number" value={formData.number} onChange={handleChange('number')} emailError={errors.number} />
            {errors.number && <p className="error-message" aria-live="polite">{errors.number}</p>}
            <Input placeholder="Location" value={formData.location} onChange={handleChange('location')} emailError={errors.location} />
            {errors.location && <p className="error-message" aria-live="polite">{errors.location}</p>}
            <div className="action-button">
              {formData.id && <Button type="secondary" onClick={handleDelete} disabled={loading}>DELETE</Button>}
              <Button type="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'SAVING...' : 'CONFIRM'}</Button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', width: '100%' }}>
              {listItems.map((item) => (
                <LockerItem key={item.id} item={item} onEdit={handleEdit} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lockers;