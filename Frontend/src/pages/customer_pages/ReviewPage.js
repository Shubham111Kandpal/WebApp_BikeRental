import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "../css/ReviewPage.css";
import Header from '../components/Header';

const baseURL = "http://127.0.0.1:8004/reviews/";

function ReviewPage() {
  const { state } = useLocation();
  const [newReview, setNewReview] = useState({
        user_id: '',
        bike_id: '',
        rating: '',
        comment: '',
        review_date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
      if (state && state.userId && state.bike_id) { 
          setNewReview(prev => ({
              ...prev,
              user_id: state.userId,
              bike_id: state.bike_id
          }));
      }
  }, [state]);

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create review: ${errorText}`);
      }

      // Reset the form fields after successful submission
      setNewReview({
        user_id: "",
        bike_id: "",
        rating: "",
        comment: "",
        review_date: new Date().toISOString().split("T")[0],
      });

      alert("Review submitted successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="review-page">
      <Header />
      <h1>Write a Review</h1>

      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          onChange={handleInputChange}
          value={newReview.user_id}
        />
        <input
          type="number"
          name="bike_id"
          placeholder="Bike ID"
          onChange={handleInputChange}
          value={newReview.bike_id}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          onChange={handleInputChange}
          value={newReview.rating}
        />
        <textarea
          name="comment"
          placeholder="Comment"
          onChange={handleInputChange}
          value={newReview.comment}
        />
        <input
          type="date"
          name="review_date"
          onChange={handleInputChange}
          value={newReview.review_date}
        />
        <button type="submit">Add Review</button>
      </form>
    </div>
  );
}

export default ReviewPage;
