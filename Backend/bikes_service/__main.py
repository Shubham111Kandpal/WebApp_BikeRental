from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
from pathlib import Path
from typing import Optional
import mysql.connector      

app = FastAPI()

# Allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

######################### SQLite connection ########################
# conn = sqlite3.connect('bikes.db')

# Get the path to the parent directory of your FastAPI application
# parent_directory = Path(__file__).resolve().parent.parent
# # print(parent_directory)

# # Specify the path to the SQLite database file in the data directory
# db_file_path = parent_directory / "my_ride.db"

# # Check if the database file exists
# if not db_file_path.exists():
#     # If the database file doesn't exist, use a local database file from the same location
#     local_db_file_path = Path(__file__).resolve().parent / "local_bike.db"
#     db_file_path = local_db_file_path

# # print(db_file_path)
# conn = sqlite3.connect(db_file_path)

# cursor = conn.cursor()
######################### SQLite connection ##########################
######################### mysql connectivity #########################

# MySQL connection
# db_connection = mysql.connector.connect(
#     host="localhost",  # Use the service name defined in docker-compose.yml
#     user="your_username",
#     password="your_password",
#     database="your_database"
# )
db_connection = mysql.connector.connect(
    host='localhost',  # or '127.0.0.1' for IPv4 loopback
    port='3306',  # Specify the port number here
    user='root',
    password='root_password',
    database='your_database'
)

cursor = db_connection.cursor()

######################### mysql connectivity #########################

# # Bike model
# class Bike(BaseModel):
#     model: str
#     status: Optional[str]
#     location: str
#     condition: str
#     price_per_hour: float
#     last_maintenance_date: str
#     maintenance_history: str


# class BikeResponse(BaseModel):
#     id: int
#     model: str
#     status: Optional[str]
#     location: str
#     condition: str
#     price_per_hour: float
#     last_maintenance_date: str
#     maintenance_history: str

# Bike model
class Bike(BaseModel):
    bike_id: int
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


# # Routes
# @app.post("/bikes/", response_model=Bike)
# async def create_bike(bike: Bike):
#     cursor.execute('''
#         INSERT INTO Bikes 
#         (model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history) 
#         VALUES (?, ?, ?, ?, ?, ?, ?)
#     ''', (
#         bike.model, bike.bike_status, bike.current_location, bike.bike_condition,
#         bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history
#     ))
#     conn.commit()
#     return bike



# @app.get("/bikes/", response_model=List[BikeResponse])
# async def read_bikes():
#     cursor.execute('SELECT * FROM Bikes')
#     bikes = cursor.fetchall()
#     bike_objects = []
#     for bike in bikes:
#         bike_obj = BikeResponse(
#             id=bike[0],
#             model=bike[1],
#             status=bike[2],
#             location=bike[3],
#             condition=bike[4],
#             price_per_hour=bike[5],
#             last_maintenance_date=bike[6],
#             maintenance_history=bike[7]
#         )
#         bike_objects.append(bike_obj)
#     return bike_objects


# # Routes
# @app.post("/bikes/", response_model=Bike)
# async def create_bike(bike: Bike):
#     cursor.execute('''
#         INSERT INTO Bikes 
#         (bike_id, model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history) 
#         VALUES (?, ?, ?, ?, ?, ?, ?)
#     ''', (
#         bike.bike_id, bike.model, bike.bike_status, bike.current_location, bike.bike_condition,
#         bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history
#     ))
#     conn.commit()
#     return bike



# @app.post("/bikes/", response_model=Bike)
# async def create_bike(bike: Bike):
#     try:
#         # Cast price_per_hour to float
#         bike.price_per_hour = float(bike.price_per_hour)

#         sql_statement = '''
#             INSERT INTO Bikes 
#             (bike_id, model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history) 
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
#         '''
#         values = (
#             bike.bike_id, bike.model, bike.bike_status, bike.current_location, bike.bike_condition,
#             bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history
#         )
#         print("Executing SQL statement:", sql_statement)
#         print("Values:", values)
        
#         cursor.execute(sql_statement, values)
#         db_connection.commit()
#         return bike
#     except Exception as e:
#         # Log the exception or print it for debugging
#         print("An error occurred during the POST request:", e)
#         # Raise an HTTPException with a 500 Internal Server Error status code
#         raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/bikes/", response_model=Bike)
async def create_bike(bike: Bike):
    try:
        # Cast price_per_hour to float
        bike.price_per_hour = float(bike.price_per_hour)

        # Remove trailing whitespaces from the string fields
        model = bike.model.strip()
        current_location = bike.current_location.strip()
        bike_condition = bike.bike_condition.strip()
        last_maintenance_date = bike.last_maintenance_date.strip()
        maintenance_history = bike.maintenance_history.strip()

        # Remove trailing commas from the string fields
        model = model.rstrip(',')
        current_location = current_location.rstrip(',')
        bike_condition = bike_condition.rstrip(',')
        maintenance_history = maintenance_history.rstrip(',')

        sql_statement = '''
            INSERT INTO Bikes 
            (bike_id, model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        '''
        values = (
            bike.bike_id, model, bike.bike_status, current_location, bike_condition,
            bike.price_per_hour, last_maintenance_date, maintenance_history
        )
        print("Executing SQL statement:", sql_statement)
        print("Values:", values)
        
        cursor.execute(sql_statement, values)
        db_connection.commit()
        return bike
    except Exception as e:
        # Log the exception or print it for debugging
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

@app.get("/bikes/{bike_id}", response_model=Bike)
async def read_bike(bike_id: int):
    cursor.execute('SELECT * FROM Bikes WHERE bike_id = ?', (bike_id,))
    bike = cursor.fetchone()
    if bike is None:
        raise HTTPException(status_code=404, detail="Bike not found")
    
    # Create a Bike object from the fetched data
    bike_obj = Bike(
        model=bike[1],
        status=bike[2],
        location=bike[3],
        condition=bike[4],
        price_per_hour=bike[5],
        last_maintenance_date=bike[6],
        maintenance_history=bike[7]
    )
    
    return bike_obj


@app.put("/bikes/{bike_id}", response_model=Bike)
async def update_bike(bike_id: int, bike: Bike):
    cursor.execute('''
        UPDATE Bikes 
        SET model = ?, status = ?, location = ?, condition = ?, 
        price_per_hour = ?, last_maintenance_date = ?, maintenance_history = ?
        WHERE bike_id = ?
    ''', (
        bike.model, bike.status, bike.location, bike.condition,
        bike.price_per_hour, bike.last_maintenance_date, bike.maintenance_history, bike_id
    ))
    conn.commit()
    return bike


@app.delete("/bikes/{bike_id}")
async def delete_bike(bike_id: int):
    cursor.execute('DELETE FROM Bikes WHERE bike_id = ?', (bike_id,))
    conn.commit()
    return {"message": "Bike deleted successfully"}
