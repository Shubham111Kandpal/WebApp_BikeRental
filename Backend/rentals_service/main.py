from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
from pathlib import Path
from typing import Optional
from fastapi import HTTPException
import mysql.connector  
from decimal import Decimal
from dotenv import load_dotenv
import os
 
app = FastAPI()
 
# Allow requests from all origins
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
 
 
 
# Rental model
class Rental(BaseModel):
    booking_id: int  
    user_id: int
    bike_id: int
    year: int
    hour: int
    season: int
    holiday: bool
    workingday: bool
    weather: int
    temp: float
    atemp: float
    humidity: float
    windspeed: float
    count: int
 
 
@app.post("/rentals/", response_model=Rental)
async def create_rental(rental: Rental):
    try:
        cursor.execute('''
            INSERT INTO Rentals
            (booking_id, user_id, bike_id, year, hour, season, holiday, workingday, weather, temp, atemp, humidity, windspeed, count)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            rental.booking_id, rental.user_id, rental.bike_id, rental.year, rental.hour,
            rental.season, rental.holiday, rental.workingday, rental.weather,
            rental.temp, rental.atemp, rental.humidity, rental.windspeed, rental.count
        ))
        db_connection.commit()
        # Get the auto-generated id of the new rental
        rental_id = cursor.lastrowid
        # Return the created rental with the generated id
        rental.booking_id = rental_id
        return rental
    except Exception as e:
        # Log the exception
        print(f"Error creating rental: {e}")
        # Raise an HTTPException with status code 422 and error message
        raise HTTPException(status_code=422, detail=str(e))
 
 
 
@app.get("/rentals/", response_model=List[Rental])
async def read_rentals():
    with db_connection.cursor(dictionary=True) as cursor:
        cursor.execute('SELECT * FROM Rentals')
        rentals = cursor.fetchall()
   
    # Convert each rental record to Rental model
    rental_objects = [
        Rental(
            booking_id=int(rental['booking_id']),
            user_id=int(rental['user_id']),
            bike_id=int(rental['bike_id']),
            year=int(rental['year']),
            hour=int(rental['hour']),
            season=int(rental['season']),
            holiday=bool(rental['holiday']),
            workingday=bool(rental['workingday']),
            weather=int(rental['weather']),
            temp=float(rental['temp']),
            atemp=float(rental['atemp']),
            humidity=float(rental['humidity']),
            windspeed=float(rental['windspeed']),
            count=int(rental['count'])  # Ensure count is treated as integer
        ) for rental in rentals
    ]
    return rental_objects
 
 
@app.get("/rentals/{rental_id}", response_model=Rental)
async def read_rental(rental_id: int):
    cursor.execute('SELECT * FROM Rentals WHERE rental_id = %s', (rental_id,))
    rental = cursor.fetchone()
    if rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
 
    # Convert the tuple to a dictionary
    rental_dict = {
        'booking_id': rental[0],
        'user_id': rental[1],
        'bike_id': rental[2],
        'year': rental[3],
        'hour': rental[4],
        'season': rental[5],
        'holiday': bool(rental[6]),
        'workingday': bool(rental[7]),
        'weather': rental[8],
        'temp': float(rental[9]),
        'atemp': float(rental[10]),
        'humidity': float(rental[11]),
        'windspeed': float(rental[12]),
        'count': rental[13]
    }
 
    return Rental(**rental_dict)
 
 
@app.put("/rentals/{rental_id}", response_model=Rental)
async def update_rental(rental_id: int, rental: Rental):
    cursor.execute('''
        UPDATE Rentals
        SET booking_id = %s, user_id = %s, bike_id = %s, year = %s, hour = %s, season = %s,
        holiday = %s, workingday = %s, weather = %s, temp = %s, atemp = %s,
        humidity = %s, windspeed = %s, count = %s
        WHERE rental_id = %s
    ''', (
        rental.booking_id, rental.user_id, rental.bike_id, rental.year, rental.hour,
        rental.season, rental.holiday, rental.workingday, rental.weather,
        rental.temp, rental.atemp, rental.humidity, rental.windspeed,
        rental.count, rental_id
    ))
    db_connection.commit()
    return rental
 
 
@app.delete("/rentals/{rental_id}")
async def delete_rental(rental_id: int):
    cursor.execute('DELETE FROM Rentals WHERE rental_id = ?', (rental_id,))
    db_connection.commit()
    return {"message": "Rental deleted successfully"}