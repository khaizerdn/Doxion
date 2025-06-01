import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button';
import Input from './components/Input';
import { validateRequired } from '../utils/validators';
import useKeyboardPadding from '../utils/useKeyboardPadding';

const LockerItem = ({ item, onEdit, espDevices }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Find the associated ESP device using the locks field
  const associatedEsp = item.locks && espDevices.find((esp) => esp.locks === item.locks);

  if (item.isAdd) {
    return (
      <>
        <p style={{ marginBottom: '10px' }}>Select any following lockers below to edit.</p>
        <li style={{ width: '100%', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            type="primary"
            onClick={() => onEdit(null)}
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
        <span style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>Locker Name: {item.number}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>
          {item.locks ? `${item.locks.replace('Lock', 'Lock ')} - ${item.ip_address || 'No IP'}` : 'No ESP Assigned'}
        </span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>
          Last Detected: {associatedEsp ? new Date(associatedEsp.detected_at).toLocaleString() : 'N/A'}
        </span>
      </div>
    </li>
  );
};

const EspDeviceItem = ({ item, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const lockName = item.locks.replace('Lock', 'Lock ');

  return (
    <li
      onClick={() => onSelect(item)}
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
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8 8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', gap: '12px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>{lockName}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>IP: {item.ip_address}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>
          Last Detected: {new Date(item.detected_at).toLocaleString()}
        </span>
      </div>
    </li>
  );
};

function Lockers() {
  useKeyboardPadding('.main-container-two');
  const [lockers, setLockers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [espDevices, setEspDevices] = useState([]);
  const [view, setView] = useState('lockers');
  const [formData, setFormData] = useState({ id: null, number: '', device_name: '', ip_address: '', locks: '', leds: '' });
  const [errors, setErrors] = useState({ number: '', device: '' });
  const [loading, setLoading] = useState(false);
  const [backendIp, setBackendIp] = useState(''); // New state for backend IP

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchLockers();
    fetchEspDevices();
    fetchBackendIp(); // Fetch backend IP on mount
  }, []);

  const fetchLockers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lockers');
      if (!response.ok) throw new Error('Failed to fetch lockers');
      const data = await response.json();
      setLockers(data);
    } catch (error) {
      console.error('Error fetching lockers:', error);
    }
  };

  const fetchEspDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/espdetected');
      if (!response.ok) throw new Error('Failed to fetch ESP devices');
      const data = await response.json();
      // Sort devices by detected_at in ascending order (oldest first)
      const sortedData = data.sort((a, b) => new Date(a.detected_at) - new Date(b.detected_at));
      setEspDevices(sortedData);
    } catch (error) {
      console.error('Error fetching ESP devices:', error);
    }
  };

  // New function to fetch backend IP
  const fetchBackendIp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get-ip');
      if (!response.ok) throw new Error('Failed to fetch backend IP');
      const data = await response.json();
      setBackendIp(data.ip_address);
    } catch (error) {
      console.error('Error fetching backend IP:', error);
      setBackendIp('Unable to detect IP');
    }
  };

  const filteredLockers = lockers.filter((locker) =>
    locker.number.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listItems = [
    { id: 'add', name: 'Add Locker', isAdd: true },
    ...filteredLockers.map((locker) => ({ ...locker, isAdd: false })),
  ];

  const handleEdit = (item) => {
    if (item === null || item.isAdd) {
      setFormData({ id: null, number: '', device_name: '', ip_address: '', locks: '', leds: '' });
    } else {
      setFormData({
        id: item.id,
        number: item.number,
        device_name: item.device_name || '',
        ip_address: item.ip_address || '',
        locks: item.locks || '',
        leds: item.leds || '',
      });
    }
    setView('form');
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
      number: validateRequired(formData.number, 'Locker Number').error,
      device: '',
    };

    if (formData.device_name && formData.ip_address && formData.locks) {
      const isDuplicate = lockers.some(
        (locker) =>
          locker.id !== formData.id &&
          locker.device_name === formData.device_name &&
          locker.ip_address === formData.ip_address &&
          locker.locks === formData.locks
      );
      if (isDuplicate) {
        newErrors.device = 'This locker is already registered.';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const url = formData.id ? `http://localhost:5000/api/lockers/${formData.id}` : 'http://localhost:5000/api/lockers';
      const method = formData.id ? 'PUT' : 'POST';
      const body = {
        number: formData.number,
        device_name: formData.device_name,
        ip_address: formData.ip_address,
        locks: formData.locks,
        leds: formData.leds,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await fetchLockers();
        setFormData({ id: null, number: '', device_name: '', ip_address: '', locks: '', leds: '' });
        setView('lockers');
      } else {
        const errorData = await response.json();
        setErrors((prev) => ({ ...prev, number: errorData.error || 'Failed to save locker' }));
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
        await fetchLockers();
        setFormData({ id: null, number: '', device_name: '', ip_address: '', locks: '', leds: '' });
        setView('lockers');
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
    setFormData({ id: null, number: '', device_name: '', ip_address: '', locks: '', leds: '' });
    setView('lockers');
  };

  const handleSelectEspView = () => {
    setView('esp');
  };

  const handleSelectEsp = (device) => {
    setFormData((prev) => ({
      ...prev,
      device_name: device.device_name,
      ip_address: device.ip_address,
      locks: device.locks,
      leds: device.leds,
    }));
    setView('form');
  };

  const styles = `
    .action-button { 
      display: flex; 
      justify-content: space-between; 
      gap: 10px; 
      margin-top: 20px; 
    }
    .esp-button {
      width: 100%;
      height: var(--global-input-height);
      margin: 10px 0;
      padding: 20px;
      font-size: var(--font-size-2);
      font-family: inherit;
      font-weight: normal;
      color: var(--color-muted-dark);
      background-color: var(--elevation-1);
      border: 1px solid var(--elevation-3);
      border-radius: var(--global-border-radius);
      cursor: pointer;
      text-align: left;
      outline: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    .esp-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .esp-button:focus {
      border-color: var(--color-primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 5px;
    }
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
      padding: 10px 20px;
      font-size: 1.5rem;
    }
  `;

  return (
    <div className="main-container-two">
      <div className="content-wrapper">
        <style>{styles}</style>
        <div className="header-container">
          <div className="title-container">
            <BackButton
              onClick={
                view === 'form'
                  ? handleCancel
                  : view === 'esp'
                  ? () => setView('form')
                  : () => window.history.back()
              }
            />
            <h2 style={{ margin: 0 }}>
              {view === 'lockers' ? 'Lockers' : view === 'form' ? (formData.id ? 'Edit Locker' : 'Add Locker') : 'ESP Devices'}
            </h2>
          </div>
          {view === 'lockers' && (
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          )}
        </div>
        {view === 'form' ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>
              {formData.id ? 'Edit the locker details below.' : 'Please fill up the form below to add a new locker.'}
            </p>
            <Input placeholder="Locker Number" value={formData.number} onChange={handleChange('number')} emailError={errors.number} />
            {errors.number && <p className="error-message" aria-live="polite">{errors.number}</p>}
            <button className="esp-button" onClick={handleSelectEspView}>
              {formData.locks
                ? `${formData.locks.replace('Lock', 'Lock ')} - ${formData.ip_address || 'No IP'}`
                : 'Select ESP Device'}
            </button>
            {errors.device && <p className="error-message" aria-live="polite">{errors.device}</p>}
            <div className="action-button">
              {formData.id && <Button type="secondary" onClick={handleDelete} disabled={loading}>DELETE</Button>}
              <Button type="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'SAVING...' : 'CONFIRM'}</Button>
            </div>
          </div>
        ) : view === 'esp' ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>Select an ESP device from the list below.</p>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', width: '100%' }}>
              {espDevices.length > 0 ? (
                espDevices.map((device) => (
                  <EspDeviceItem key={device.id} item={device} onSelect={handleSelectEsp} />
                ))
              ) : (
                <li style={{ textAlign: 'center', padding: '20px', color: 'var(--color-muted-dark)' }}>
                  No ESP devices detected yet.
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px', color: 'var(--color-muted-dark)' }}>
              Backend IPv4: {backendIp || 'Loading...'}
            </p>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', width: '100%' }}>
              {listItems.map((item) => (
                <LockerItem key={item.id} item={item} onEdit={handleEdit} espDevices={espDevices} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lockers;