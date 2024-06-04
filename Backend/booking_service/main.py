from datetime import datetime  # Imports the datetime module
import random
from typing import Optional, List
import random
from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import sqlite3
from pathlib import Path
from typing import List
import mysql.connector 
from dotenv import load_dotenv
import os


app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


load_dotenv()  # Take environment variables from .env.

db_connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_DATABASE')
)
cursor = db_connection.cursor()


class Booking(BaseModel):
    user_id: int
    bike_id: int
    duration_hours: int
    location:str  # Assuming you pass how many hours the bike will be booked

class UpdateBooking(BaseModel):
    booking_id: int
    user_id: int
    bike_id: int

class BookingResponse(BaseModel):
    booking_id: int
    user_id: int
    bike_id: int
    location: str
    blocked_amount: float
    payment_state: str
    start_time: datetime
    end_time: Optional[datetime]
    lock_code: str

    class Config:
        arbitrary_types_allowed = True


def generate_lock_code():
    return ''.join(random.choices('0123456789', k=6))

@app.get("/bookings/", response_model=List[BookingResponse])
async def get_all_bookings():
    cursor.execute("SELECT booking_id, user_id, bike_id, location, blocked_amount, payment_state, start_time, end_time, lock_code FROM Bookings")
    bookings = cursor.fetchall()
    return [BookingResponse(
        booking_id=booking[0],
        user_id=booking[1],
        bike_id=booking[2],
        location=booking[3],
        blocked_amount=booking[4],
        payment_state=booking[5],
        start_time=booking[6],
        end_time=booking[7],
        lock_code=booking[8]
    ) for booking in bookings]

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: int):
    # Execute the SQL query to fetch booking details by booking_id
    cursor.execute("SELECT booking_id, user_id, bike_id, location, blocked_amount, payment_state, start_time, end_time, lock_code FROM Bookings WHERE booking_id = %s", (booking_id,))
    booking = cursor.fetchone()

    # If no booking is found, raise a 404 error
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Return the booking details in a structured format
    return BookingResponse(
        booking_id=booking[0],
        user_id=booking[1],
        bike_id=booking[2],
        location=booking[3],
        blocked_amount=booking[4],
        payment_state=booking[5],
        start_time=booking[6],
        end_time=booking[7],
        lock_code=booking[8]
    )

@app.post("/bookings/")
async def book_bike(booking: Booking):
    # Check for existing active booking for the same user or bike
    cursor.execute("""
        SELECT 1 FROM Bookings
        WHERE (user_id = %s OR bike_id = %s) AND payment_state = 'Booked'
    """, (booking.user_id, booking.bike_id))
    existing_booking = cursor.fetchone()
 
    if existing_booking:
        raise HTTPException(status_code=400, detail="Already Booked")
 
    # Fetch user details to check wallet balance
    cursor.execute("SELECT wallet_balance FROM Users WHERE user_id = %s", (booking.user_id,))
    user_details = cursor.fetchone()
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")
    wallet_balance = Decimal(user_details[0])
 
    # Fetch bike details to check availability and get price per hour
    cursor.execute("SELECT current_location, price_per_hour FROM Bikes WHERE bike_id = %s", (booking.bike_id,))
    bike_details = cursor.fetchone()
    if not bike_details or booking.location != bike_details[0]:
        raise HTTPException(status_code=404, detail="Bike not available at the specified location")
    price_per_hour = Decimal(bike_details[1])
 
    # Calculate blocked amount based on the booking duration
    blocked_amount = price_per_hour * Decimal(booking.duration_hours)
 
    # Ensure user's wallet balance can cover the blocked amount
    if wallet_balance < blocked_amount:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
 
    # Deduct the blocked amount from user's wallet balance
    new_wallet_balance = wallet_balance - blocked_amount
 
    # Insert the booking record
    lock_code = ''.join(random.choices('0123456789', k=6))  # Generate a 6-digit lock code
    start_time = datetime.now()
    cursor.execute("""
        INSERT INTO Bookings (user_id, bike_id, location, blocked_amount, payment_state, start_time, lock_code)
        VALUES (%s, %s, %s, %s, 'Booked', %s, %s)
    """, (booking.user_id, booking.bike_id, booking.location, blocked_amount, start_time, lock_code))
 
    # Update the user's wallet balance
    cursor.execute("UPDATE Users SET wallet_balance = %s WHERE user_id = %s", (new_wallet_balance, booking.user_id))
 
    db_connection.commit()
 
    return {
        "message": "Bike booked successfully",
        "new_wallet_balance": float(new_wallet_balance),  # Return as float for JSON serialization
        "lock_code": lock_code,
        "start_time": start_time.isoformat()
    }


@app.put("/bookings/")
async def update_booking(update: UpdateBooking):
    # Check if the booking with provided booking_id, user_id, and bike_id exists
    cursor.execute("""
        SELECT
            B.start_time, B.blocked_amount, Bi.price_per_hour, U.wallet_balance
        FROM
            Bookings B
            JOIN Bikes Bi ON B.bike_id = Bi.bike_id
            JOIN Users U ON B.user_id = U.user_id
        WHERE
            B.booking_id = %s AND B.user_id = %s AND B.bike_id = %s
    """, (update.booking_id, update.user_id, update.bike_id))
    booking = cursor.fetchone()
 
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
 
    # Unpack fetched details
    start_time, blocked_amount, price_per_hour, wallet_balance = booking
    start_time = datetime.fromisoformat(start_time) if isinstance(start_time, str) else start_time
 
    # Calculate the duration in hours and the final price
    end_time = datetime.now()
    duration_hours = (end_time - start_time).total_seconds() / 3600
    duration_hours_decimal = Decimal(str(duration_hours))  # Convert float to Decimal via string for accuracy
 
    final_price = Decimal(blocked_amount) - (duration_hours_decimal * Decimal(price_per_hour))
    new_wallet_balance = Decimal(wallet_balance) + final_price
 
    # Perform database updates within a transaction
    try:
        cursor.execute("UPDATE Bookings SET end_time = %s, payment_state = 'Ride Completed' WHERE booking_id = %s",
                       (end_time.strftime('%Y-%m-%d %H:%M:%S'), update.booking_id))
        cursor.execute("UPDATE Users SET wallet_balance = %s WHERE user_id = %s",
                       (new_wallet_balance, update.user_id))
        db_connection.commit()
    except Exception as e:
        db_connection.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
 
    return {
        "message": "Booking updated successfully",
        "details": {
            "booking_id": update.booking_id,
            "final_price": float(final_price),  # Convert Decimal back to float for JSON serialization
            "new_wallet_balance": float(new_wallet_balance),
            "end_time": end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
    }