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



load_dotenv()  # Take environment variables from .env.

db_connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_DATABASE')
)
cursor = db_connection.cursor()



# Review model
class Review(BaseModel):
    user_id: int
    bike_id: int
    rating: int
    comment: str
    review_date: str

class GetReview(BaseModel):
    review_id:int
    user_id: int
    bike_id: int
    rating: int
    comment: str
    review_date: str

class UpdateReview(BaseModel):
    user_id: Optional[int] = None
    bike_id: Optional[int] = None
    rating: Optional[int] = None
    comment: Optional[str] = None
    review_date: Optional[str] = None


# Routes
@app.post("/reviews/", response_model=Review)
async def create_review(review: Review):
    cursor.execute('''
        INSERT INTO Reviews 
        (user_id, bike_id, rating, comment, review_date) 
        VALUES (%s, %s, %s, %s, %s)
    ''', (
        review.user_id, review.bike_id, review.rating, review.comment, review.review_date
    ))
    db_connection.commit()
    review_id = cursor.lastrowid  # Get the last inserted id
    return {**review.dict(), "review_id": review_id}


@app.get("/reviews/", response_model=List[Review])
async def read_reviews():
    cursor.execute('SELECT user_id, bike_id, rating, comment, review_date FROM Reviews')
    reviews = cursor.fetchall()
    review_objects = []
    for review in reviews:
        review_obj = Review(
            user_id=review[0],
            bike_id=review[1],
            rating=review[2],
            comment=review[3],
            review_date=review[4].strftime('%Y-%m-%d %H:%M:%S')
        )
        review_objects.append(review_obj)
    return review_objects


@app.get("/reviews/{review_id}", response_model=GetReview)
async def read_review(review_id: int):
    # Execute the query to fetch the review
    cursor.execute('SELECT review_id, user_id, bike_id, rating, comment, review_date FROM Reviews WHERE review_id = %s', (review_id,))
    review = cursor.fetchone()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")

    # Check if review_date is not None and format it as string
    review_date_formatted = review[5].strftime('%Y-%m-%d %H:%M:%S') if review[5] else None

    # Return the formatted review data using the GetReview model
    return GetReview(
        review_id=review[0],
        user_id=review[1],
        bike_id=review[2],
        rating=review[3],
        comment=review[4],
        review_date=review_date_formatted
    )


@app.put("/reviews/{review_id}", response_model=Review)
async def update_review(review_id: int, review_update: UpdateReview):
    updates = []
    values = []
    for field, value in review_update.dict(exclude_none=True).items():
        updates.append(f"{field} = %s")
        values.append(value)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    update_stmt = f"UPDATE Reviews SET {', '.join(updates)} WHERE review_id = %s"
    values.append(review_id)
    cursor.execute(update_stmt, tuple(values))
    db_connection.commit()

    # Fetch the updated review data
    cursor.execute('SELECT review_id, user_id, bike_id, rating, comment, review_date FROM Reviews WHERE review_id = %s', (review_id,))
    updated_review = cursor.fetchone()
    if updated_review:
        review_dict = {
            'review_id': updated_review[0],
            'user_id': updated_review[1],
            'bike_id': updated_review[2],
            'rating': updated_review[3],
            'comment': updated_review[4],
            'review_date': updated_review[5].strftime('%Y-%m-%d %H:%M:%S') if updated_review[5] else None
        }
        return Review(**review_dict)
    else:
        raise HTTPException(status_code=404, detail="Error updating review.")



@app.delete("/reviews/{review_id}")
async def delete_review(review_id: int):
    cursor.execute('DELETE FROM Reviews WHERE review_id = %s', (review_id,))
    db_connection.commit()
    return {"message": "Review deleted successfully"}
