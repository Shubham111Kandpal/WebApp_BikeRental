import React, { useState, useEffect } from 'react';
import PasscodeModal from './PasscodeModal';
import '../css/ConfirmationModal.css';

function ConfirmationModal({ bike, onClose }) {
    const [showConfirm, setShowConfirm] = useState(true);
    const [showPasscode, setShowPasscode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [lockCode, setLockCode] = useState(''); 
    const user_id = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (username) {
            fetchWalletBalance(username);
        }
    }, []);

    const fetchWalletBalance = async (username) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8005/users/${encodeURIComponent(username)}`);
            const userData = await response.json();
            setWalletBalance(userData.wallet_balance);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            alert('Failed to fetch user data. Please try again.');
        }
        setIsLoading(false);
    };

    const handleProceedToPayment = async () => {
        setShowConfirm(false);
        setIsLoading(true);
    
        // Prepare the POST request payload
        const payload = {
            user_id: parseInt(user_id), 
            bike_id: bike.bike_id, 
            duration_hours: 1,
            location: bike.current_location
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8006/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.detail);
            }
    
            if (responseData.message === "Bike booked successfully") {
                console.log('Booking successful:', responseData);
                setLockCode(responseData.lock_code);
                setTimeout(() => {
                    setIsLoading(false);
                    setShowPasscode(true);
                }, 2000);
                setErrorMessage('');
            } else {
                throw new Error('Failed to book');
            }

            } catch (error) {
                console.error('Failed to book bike:', error);
                setErrorMessage(error.message);
                setIsLoading(false);
                setShowConfirm(true); 
            }
    };
    
    return (
        <>
            {showConfirm && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h1>Booking Confirmation</h1>
                        <div className="confirmation-details">
                            <p>Username: <strong>{username}</strong></p>
                            <p>Pickup Point: <strong>{bike.current_location}</strong></p>
                            <p>Bike Model: <strong>{bike.model}</strong></p>
                            <p>Bike Status: <strong>{bike.bike_status}</strong></p>
                            <p>Bike ID: <strong>{bike.bike_id}</strong></p>
                            <p>Price per Hour: <strong>￡{bike.price_per_hour} per hour</strong></p>
                            <p>Duration: <strong>{"1 hour"}</strong></p>
                            <p>Wallet Balance: <strong>￡{walletBalance}</strong></p>
                            <p>Balance on hold: <strong>￡{bike.price_per_hour * 5}</strong></p>
                        </div>
                        {errorMessage && (
                            <div className="error-message">
                                <p>Error: {errorMessage}</p>
                            </div>
                        )}
                        <button onClick={handleProceedToPayment}>Confirm and Proceed to Payment</button>
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="loading-backdrop">
                    <div className="loading-content">
                        <img src="/loading-icon.gif" alt="Loading" />
                    </div>
                </div>
            )}
            {showPasscode && <PasscodeModal onClose={onClose} lockCode={lockCode} />}
        </>
    );
    
}

export default ConfirmationModal;

