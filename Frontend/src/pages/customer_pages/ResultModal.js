import React from 'react';
import '../css/StopRideModal.css';

function ResultModal({ isVisible, message, onClose, isError }) {
    if (!isVisible) return null;

    return (
        <div className="result-modal" style={{ background: isError ? '#ffdddd' : '#ddffdd' }}>
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </div>
    );
}

export default ResultModal;
