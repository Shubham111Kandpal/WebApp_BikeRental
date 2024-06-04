from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
import mysql.connector   
from pathlib import Path
from typing import Optional
from datetime import datetime
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

class User(BaseModel):
    username: str
    password: str 
    email: str
    phone_number: str
    credit_card_info: Optional[str] = None
    registration_date: str
    last_login: Optional[str] = None
    wallet_balance:Optional[float] = None
class UpdateUserModel(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    credit_card_info: Optional[str] = None
    registration_date: Optional[str] = None
    last_login: Optional[str] = None
    wallet_balance:Optional[float] = None


class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    phone_number: str
    registration_date: str
    last_login: Optional[str] = None 
    wallet_balance:float


# Modify the read_users() function to return a list of UserResponse objects
@app.get("/users/", response_model=List[UserResponse])
async def read_users():
    cursor.execute('SELECT user_id, username, email, phone_number, registration_date, wallet_balance FROM Users')
    print("got record")
    users = cursor.fetchall()
    user_objects = []
    for user in users:
        user_obj = UserResponse(
            user_id=user[0],
            username=user[1],
            email=user[2],
            phone_number=user[3],
            registration_date=user[4].strftime('%Y-%m-%d %H:%M:%S') ,
            wallet_balance=user[5]
        )
        user_objects.append(user_obj)
    return user_objects





# Routes
@app.post("/users/", response_model=User)
async def create_user(user: User):
    print('hit')
    # Use a tuple to conditionally include the optional fields in the SQL query
    if user.credit_card_info is None and user.last_login is None:
        cursor.execute('''
            INSERT INTO Users 
            (username, password, email, phone_number, registration_date) 
            VALUES (%s, %s, %s, %s, %s)
        ''', (
            user.username, user.password, user.email, user.phone_number,
            user.registration_date
        ))
    elif user.credit_card_info is None:
        cursor.execute('''
            INSERT INTO Users 
            (username, password, email, phone_number, registration_date, last_login) 
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            user.username, user.password, user.email, user.phone_number,
            user.registration_date, user.last_login
        ))
    elif user.last_login is None:
        cursor.execute('''
            INSERT INTO Users 
            (username, password, email, phone_number, credit_card_info, registration_date) 
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            user.username, user.password, user.email, user.phone_number,
            user.credit_card_info, user.registration_date
        ))
    else:
        cursor.execute('''
            INSERT INTO Users 
            (username, password, email, phone_number, credit_card_info, registration_date, last_login) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''', (
            user.username, user.password, user.email, user.phone_number,
            user.credit_card_info, user.registration_date, user.last_login
        ))
    db_connection.commit()
    return user





@app.get("/users/{username}", response_model=UserResponse)
async def read_user_by_username(username: str):
    cursor.execute('SELECT user_id, username, email, phone_number, registration_date, last_login, wallet_balance FROM Users WHERE username = %s', (username,))
    user = cursor.fetchone()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Format datetime fields as strings
    registration_date = user[4].strftime('%Y-%m-%d %H:%M:%S') if user[4] else None
    last_login = user[5].strftime('%Y-%m-%d %H:%M:%S') if user[5] else None

    return UserResponse(
        user_id=user[0],
        username=user[1],
        email=user[2],
        phone_number=user[3],
        registration_date=registration_date,
        last_login=last_login,
        wallet_balance=user[6]
    )


@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, update_data: UpdateUserModel):
    # Fetch the existing user data first to compare what needs to be updated
    cursor.execute('SELECT * FROM Users WHERE user_id = %s', (user_id,))
    existing_user = cursor.fetchone()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare the SQL query to update only provided fields
    updates = []
    params = []
    for field, value in update_data.dict(exclude_none=True).items():
        if value is not None:
            updates.append(f"{field} = %s")
            params.append(value)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields provided for update")

    # Execute the update query
    params.append(user_id)
    update_stmt = f"UPDATE Users SET {', '.join(updates)} WHERE user_id = %s"
    cursor.execute(update_stmt, params)
    db_connection.commit()

    # Fetch and return the updated user data
    cursor.execute('SELECT user_id, username, email, phone_number, registration_date, last_login, wallet_balance FROM Users WHERE user_id = %s', (user_id,))
    updated_user = cursor.fetchone()
    if updated_user:
        return UserResponse(
            user_id=updated_user[0],
            username=updated_user[1],
            email=updated_user[2],
            phone_number=updated_user[3],
            registration_date=updated_user[4].strftime('%Y-%m-%d %H:%M:%S') if updated_user[4] else None,
            last_login=updated_user[5].strftime('%Y-%m-%d %H:%M:%S') if updated_user[5] else None,
            wallet_balance=updated_user[6]
        )
    else:
        raise HTTPException(status_code=404, detail="Error updating user.")



@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    cursor.execute('DELETE FROM Users WHERE user_id = %s', (user_id,))
    db_connection.commit()
    return {"message": "User deleted successfully"}
