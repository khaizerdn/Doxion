import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './components/BackButton';

const EspDeviceItem = ({ item, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

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
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', gap: '12px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>{item.device_name}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>IP: {item.ip_address}</span>
        <span style={{ fontSize: '1.625rem', textAlign: 'left', color: 'var(--color-muted-dark)', lineHeight: '1.2' }}>Last Detected: {new Date(item.detected_at).toLocaleString()}</span>
      </div>
    </li>
  );
};

function EspDevices() {
  const [espDevices, setEspDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchEspDevices();
  }, []);

  const fetchEspDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/espdetected');
      if (!response.ok) throw new Error('Failed to fetch ESP devices');
      const data = await response.json();
      setEspDevices(data);
    } catch (error) {
      console.error('Error fetching ESP devices:', error);
    }
  };

  const handleSelect = (device) => {
    navigate('/lockers', { state: { selectedEsp: device, showForm: true } });
  };

  const handleBack = () => {
    navigate('/lockers', { state: { showForm: true } });
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
          <BackButton onClick={handleBack} />
          <h2 style={{ margin: 0 }}>ESP Devices</h2>
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ marginBottom: '10px' }}>Select an ESP device from the list below.</p>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', width: '100%' }}>
            {espDevices.length > 0 ? (
              espDevices.map((device) => (
                <EspDeviceItem key={device.id} item={device} onSelect={handleSelect} />
              ))
            ) : (
              <li style={{ textAlign: 'center', padding: '20px', color: 'var(--color-muted-dark)' }}>
                No ESP devices detected yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EspDevices;