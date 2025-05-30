// src/pages/Splash/Splash.jsx
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import eyeAnimationData from '../assets/EyeAnimation.json';

function Splash() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/main');
  };

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: eyeAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Inline styles for the Splash page (scoped to this component), using global variables
  const splashStyles = `
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #FFFFFF; /* Use global elevation-1 */
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s;
      z-index: 1000;
    }

    .splash-container:hover {
      background-color: var(--elevation-0); /* Use global elevation-0 for hover */
    }

    .splash-text {
      position: absolute;
      bottom: 30%; /* Distance from bottom edge */
      font-size: 1.5rem; /* Smaller text */
      font-weight: 700; /* Non-bold text */
      color: var(--color-accent); /* Use global text-primary */
      pointer-events: none; /* Prevent text from interfering with click */
      z-index: 1001; /* Ensure text is above animation */
    }

    .lottie-container {
      position: absolute;
      bottom: 5%;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none; /* Prevent Lottie from interfering with click */
    }
  `;

  return (
    <>
      <style>{splashStyles}</style>
      <div className="splash-container" onClick={handleClick}>
        <div className="lottie-container">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <p className="splash-text">TOUCH TO START</p>
      </div>
    </>
  );
}

export default Splash;