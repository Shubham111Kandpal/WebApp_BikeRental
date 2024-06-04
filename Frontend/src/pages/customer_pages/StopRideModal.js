import React from 'react';
import '../css/StopRideModal.css';

function StopRideModal({ isVisible, message, onConfirm, onCancel, bookingId, userId, bikeId }) {
    if (!isVisible) return null; 

    const handleConfirm = async () => {
        const payload = {
            booking_id: bookingId,
            user_id: userId,
            bike_id: bikeId
        };

        try {
            const response = await fetch('http://127.0.0.1:8006/bookings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Operation completed! ${data.details.message}. Amount deducted from wallet: £${data.details.final_price}`);
                onConfirm();
            } else {
                alert(`Failed to stop the ride. Please try again or contact Admin. Error: ${data.detail || data.message}`);
            }
        } catch (error) {
            alert(`An error occurred. Please try again. Error: ${error.message}`);
        } finally {
            onCancel(); 
        }
    };

    return (
        <div className="stop-modal-backdrop">
            <div className="stop-modal-content">
                <p>{message}</p>
                <button onClick={handleConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default StopRideModal;
