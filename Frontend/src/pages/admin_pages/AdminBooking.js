import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyBookings.css';
import AdminHeader from '../components/AdminHeader';
import moment from 'moment';  

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('http://127.0.0.1:8006/bookings/');
            const data = await response.json();
            const transformedBookings = data.map(booking => ({
                ...booking,
                booking_date: moment(booking.start_time).format("YYYY-MM-DD"),
                starttime: moment(booking.start_time).format("HH:mm"),
                endtime: booking.end_time ? moment(booking.end_time).format("HH:mm") : "",
                duration: booking.end_time ? moment.duration(moment(booking.end_time).diff(moment(booking.start_time))).humanize() : 'In progress',
            }));
            setBookings(transformedBookings);
        };
        fetchBookings();
    }, []);

    return (
        <div>
            <AdminHeader />
            <div className="table-wrapper">
                <table className="fl-table">
                  <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Booking ID</th>
                        <th>Bike ID</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                  </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.booking_id} className={booking.payment_state === 'Booked' ? 'highlighted-row' : ''}>
                            <td>{booking.user_id}</td>
                            <td>{booking.booking_id}</td>
                            <td>{booking.bike_id}</td>
                            <td>{booking.booking_date}</td>
                            <td>{booking.starttime}</td>
                            <td>{booking.endtime}</td>
                            <td>{booking.duration}</td>
                            <td>{booking.payment_state}</td>
                        </tr>
                    ))}
                </tbody>
        </table>
      </div>
    </div>
    );
}

export default AdminBookings;
