import React from 'react';

function LoadingScreen({ message }) {
    return (
        <div className="loading-screen">
            <h2>{message}</h2>
        </div>
    );
}

export default LoadingScreen;
