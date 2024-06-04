
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
from pathlib import Path
from typing import Optional
import mysql.connector 
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


# db_connection = mysql.connector.connect(
#     host="localhost",  # Use the service name defined in docker-compose.yml
#     user="your_username",
#     password="your_password",
#     database="your_database"
# )
# db_connection = mysql.connector.connect(
#     host='localhost',  # or '127.0.0.1' for IPv4 loopback
#     port='3306',  # Specify the port number here
#     user='root',
#     password='root_password',
#     database='your_database'
# )

load_dotenv()  # Take environment variables from .env.

db_connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_DATABASE')
)
cursor = db_connection.cursor()



# Bike model
class Bike(BaseModel):
    model: str
    bike_status: Optional[str]
    current_location: str
    bike_condition: str
    price_per_hour: float
    last_maintenance_date: str
    maintenance_history: str


class BikeResponse(BaseModel):
    bike_id: int
    model: str
    bike_status: Optional[str]
    current_location: str
    bike_condition: str
    price_per_hour: float
    last_maintenance_date: str
    maintenance_history: str


# Routes
@app.post("/bikes/", response_model=Bike)
async def create_bike(bike: Bike):
    try:
        # Cast price_per_hour to float
        bike.price_per_hour = float(bike.price_per_hour)

        sql_statement = '''
            INSERT INTO Bikes 
            (model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        values = (
            bike.model, bike.bike_status, bike.current_location, bike.bike_condition,
            bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history
        )
        print("Executing SQL statement:", sql_statement)
        print("Values:", values)
        
        cursor.execute(sql_statement, values)
        db_connection.commit()
        return bike
    except mysql.connector.Error as e:
        # Log the MySQL error for debugging
        print("MySQL Error:", e)
        # Raise an HTTPException with a 500 Internal Server Error status code
        raise HTTPException(status_code=500, detail="Internal Server Error")
    except Exception as e:
        # Log other exceptions for debugging
        print("An error occurred during the POST request:", e)
        # Raise an HTTPException with a 500 Internal Server Error status code
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/bikes/", response_model=List[BikeResponse])
async def read_bikes():
    cursor.execute('SELECT * FROM Bikes')
    bikes = cursor.fetchall()
    bike_objects = []
    for bike in bikes:
        bike_obj = BikeResponse(
            bike_id=bike[0],
            model=bike[1],
            bike_status=bike[2],
            current_location=bike[3],
            bike_condition=bike[4],
            price_per_hour=bike[5],
            last_maintenance_date=str(bike[6]),  # Convert date to string
            maintenance_history=bike[7]
        )
        bike_objects.append(bike_obj)
    return bike_objects

@app.get("/bikes/available", response_model=List[BikeResponse])
async def read_available_bikes():
    cursor.execute('SELECT * FROM Bikes WHERE bike_status = "available"')
    bikes = cursor.fetchall()
    bike_objects = []
    for bike in bikes:
        bike_obj = BikeResponse(
            bike_id=bike[0],
            model=bike[1],
            bike_status=bike[2],
            current_location=bike[3],
            bike_condition=bike[4],
            price_per_hour=bike[5],
            last_maintenance_date=str(bike[6]),  # Convert date to string
            maintenance_history=bike[7]
        )
        bike_objects.append(bike_obj)
    return bike_objects


@app.get("/bikes/{bike_id}", response_model=Bike)
async def read_bike(bike_id: int):
    cursor.execute('SELECT * FROM Bikes WHERE bike_id = %s', (bike_id,))
    bike = cursor.fetchone()
    if bike is None:
        raise HTTPException(status_code=404, detail="Bike not found")
    
    # Format the last_maintenance_date from datetime.date to string
    last_maintenance_date_formatted = bike[6].strftime('%Y-%m-%d') if bike[6] else None
    
    # Create a Bike object from the fetched data
    bike_obj = Bike(
        model=bike[1],
        bike_status=bike[2],
        current_location=bike[3],
        bike_condition=bike[4],
        price_per_hour=bike[5],
        last_maintenance_date=last_maintenance_date_formatted,
        maintenance_history=bike[7]
    )
    
    return bike_obj


@app.put("/bikes/{bike_id}", response_model=Bike)
async def update_bike(bike_id: int, bike: Bike):
    cursor.execute('''
    UPDATE Bikes 
    SET model = %s, bike_status = %s, current_location = %s, bike_condition = %s, 
    price_per_hour = %s, last_maintenance_date = %s, maintenance_history = %s
    WHERE bike_id = %s
''', (
    bike.model, bike.bike_status, bike.current_location, bike.bike_condition,
    bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history, bike_id
))
    db_connection.commit()
    return bike


@app.delete("/bikes/{bike_id}")
async def delete_bike(bike_id: int):
    cursor.execute('DELETE FROM Bikes WHERE bike_id = ?', (bike_id,))
    db_connection.commit()
    return {"message": "Bike deleted successfully"}
