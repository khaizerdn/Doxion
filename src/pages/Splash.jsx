// src/pages/Splash/Splash.jsx
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/main');
  };

  // Inline styles for the Splash page (scoped to this component), using global variables
  const splashStyles = `
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--elevation-1); /* Use global elevation-1 */
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s;
      z-index: 1000;
    }

    .splash-container:hover {
      background-color: var(--elevation-0); /* Use global elevation-0 for hover */
    }

    .splash-container h1 {
      font-size: 2.5rem; /* Matches global h1 size */
      color: var(--color-primary-dark); /* Use global text-primary */
      pointer-events: none; /* Prevent h1 from interfering with click */
    }
  `;

  return (
    <>
      <style>{splashStyles}</style>
      <div className="splash-container" onClick={handleClick}>
        <h1>TOUCH ANYWHERE TO START</h1>
      </div>
    </>
  );
}

export default Splash;