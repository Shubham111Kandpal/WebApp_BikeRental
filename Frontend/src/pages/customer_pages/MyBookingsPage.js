import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyBookings.css';
import Header from '../components/Header';
import StopRideModal from './StopRideModal';
import moment from 'moment';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [showStopModal, setShowStopModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const response = await fetch('http://127.0.0.1:8006/bookings/');
        const data = await response.json();
        const userId = sessionStorage.getItem('userId');  // Retrieve user ID from sessionStorage
        const userBookings = data.filter(booking => booking.user_id.toString() === userId).map(booking => ({
            ...booking,
            booking_date: moment(booking.start_time).format("YYYY-MM-DD"),
            starttime: moment(booking.start_time).format("HH:mm"),
            endtime: booking.end_time ? moment(booking.end_time).format("HH:mm") : "",
            duration: booking.end_time ? moment.duration(moment(booking.end_time).diff(moment(booking.start_time))).humanize() : 'In progress',
        }));
        setBookings(userBookings);
    };

    const handleReview = (booking) => {
        navigate(`/customer/reviews`, { state: { bike_id: booking.bike_id, userId: sessionStorage.getItem('userId') } });
    };

    const handleConfirmStopRide = () => {
        setShowStopModal(false); // Close the modal
        fetchBookings(); // Refresh bookings data
    };

    const handleCancelStopRide = () => {
        setShowStopModal(false);
        setSelectedBooking(null);  // Clear selected booking on modal close
    };

    const handleStopRide = (e, booking) => {
        e.preventDefault();
        console.log("Stopping ride for booking:", booking.booking_id);
        setSelectedBooking(booking);
        setShowStopModal(true);
    };

    return (
        <div>
            <Header />
            <h1>My Bookings</h1>
            <div className="table-wrapper">
              <table className="fl-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Bike ID</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.booking_id} className={booking.duration === 'In progress' ? 'highlighted-row' : ''}>
                            <td>{booking.booking_id}</td>
                            <td>{booking.bike_id}</td>
                            <td>{booking.booking_date}</td>
                            <td>{booking.starttime}</td>
                            <td>{booking.endtime}</td>
                            <td>{booking.duration}</td>
                            <td>{booking.payment_state}</td>
                            <td>{booking.payment_state === 'Ride Completed' ? (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleReview(booking);
                                    }}>Review Ride</a>
                                ) : (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleStopRide(e, booking);
                                    }}>Stop Ride</a>
                                )}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showStopModal && selectedBooking && (
                <StopRideModal
                    isVisible={showStopModal}
                    message="Are you sure you want to Stop the Ride?"
                    onConfirm={handleConfirmStopRide}
                    onCancel={handleCancelStopRide}
                    bookingId={selectedBooking ? selectedBooking.booking_id : null}
                    userId={selectedBooking ? selectedBooking.user_id : null}
                    bikeId={selectedBooking ? selectedBooking.bike_id : null}
                />
            )}
        </div>
    </div>
    );
}

export default MyBookings;
