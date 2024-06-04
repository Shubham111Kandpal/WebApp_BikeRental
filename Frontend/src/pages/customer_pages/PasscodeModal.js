import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PasscodeModal.css';

function PasscodeModal({ onClose, lockCode }) {
    const navigate = useNavigate();

    const handleOk = () => {
        navigate('/customer/bookings/');
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h1>Payment Confirmed</h1>
                <p>Congratulations! Your ride is confirmed. Enter the passcode and start your ride.</p>
                <p>Passcode: <strong>{lockCode}</strong></p>
                <button onClick={handleOk}>OK</button>
            </div>
        </div>
    );
}

export default PasscodeModal;
