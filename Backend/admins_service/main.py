from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import mysql.connector   
from pathlib import Path
from typing import Optional, Tuple, List
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

# # SQLite connection
# # SQLite connection
# # parent_directory = Path(__file__).resolve().parent.parent
# # db_file_path = parent_directory / "my_ride.db"
# # # print(db_file_path)

# parent_directory = Path(__file__).resolve().parent.parent
# # Specify the path to the SQLite database file in the data directory
# db_file_path = parent_directory / "my_ride.db"

# # Check if the database file exists
# if not db_file_path.exists():
#     # If the database file doesn't exist, use a local database file from the same location
#     local_db_file_path = Path(__file__).resolve().parent / "local_bike.db"
#     db_file_path = local_db_file_path

# conn = sqlite3.connect(db_file_path)

# cursor = conn.cursor()

# db_connection = mysql.connector.connect(
#     host='database_mysql',  # or '127.0.0.1' for IPv4 loopback
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


# # Create the Admins table if it doesn't exist
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS Admins (
#         admin_id INTEGER PRIMARY KEY,
#         username TEXT,
#         password TEXT,
#         email TEXT,
#         phone_number TEXT
#     )
# ''')
# conn.commit()


# Admin model
# class Admin(BaseModel):
#     username: str
#     password: str
#     email: str
#     phone_number: str

class Admin(BaseModel):
    username: str
    password: Optional[str]
    email: str
    phone_number: str

class AdminResponse(BaseModel):
    username: str
    email: str
    phone_number: str


# Routes
@app.post("/admins/", response_model=AdminResponse)
async def create_admin(admin: Admin):
    cursor.execute('''
        INSERT INTO Admins 
        (username, password, email, phone_number) 
        VALUES (%s, %s, %s, %s)
    ''', (
        admin.username, admin.password, admin.email, admin.phone_number
    ))
    db_connection.commit()
    return AdminResponse(
        username=admin.username,
        email=admin.email,
        phone_number=admin.phone_number
    )


@app.get("/admins/", response_model=List[AdminResponse])
async def read_admins():
    cursor.execute('SELECT username, email, phone_number FROM Admins')
    admins_data: List[Tuple[str, str, str]] = cursor.fetchall()
    admins = [
        AdminResponse(
            username=admin[0],
            email=admin[1],
            phone_number=admin[2]
        ) for admin in admins_data
    ]
    return admins

@app.get("/admins/{admin_id}", response_model=Admin)
async def read_admin(admin_id: int):
    cursor.execute('SELECT * FROM Admins WHERE admin_id = ?', (admin_id,))
    admin = cursor.fetchone()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin


@app.put("/admins/{admin_id}", response_model=Admin)
async def update_admin(admin_id: int, admin: Admin):
    cursor.execute('''
        UPDATE Admins 
        SET username = ?, password = ?, email = ?, phone_number = ?
        WHERE admin_id = ?
    ''', (
        admin.username, admin.password, admin.email, admin.phone_number, admin_id
    ))
    conn.commit()
    return admin


@app.delete("/admins/{admin_id}")
async def delete_admin(admin_id: int):
    cursor.execute('DELETE FROM Admins WHERE admin_id = ?', (admin_id,))
    conn.commit()
    return {"message": "Admin deleted successfully"}
