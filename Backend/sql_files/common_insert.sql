INSERT INTO Bikes (bike_id, model, bike_status, current_location, bike_condition, price_per_hour, last_maintenance_date, maintenance_history)
VALUES
(101, 'Mountain Bike', 'available', 'Central Park', 'good', 10.00, '2024-03-25', 'Cleaned and lubricated chain');

INSERT INTO Users (user_id, username, password, email, phone_number, credit_card_info, registration_date, last_login)
VALUES
(1, 'john_doe', 'password123', 'john@example.com', '+1234567890', '**** **** **** 1234', '2024-03-28 10:00:00', '2024-03-28 10:00:00');

INSERT INTO Rentals (rental_id, id, user_id, bike_id, year, hour, season, holiday, workingday, weather, temp, atemp, humidity, windspeed, count)
VALUES
(1, 1001, 1, 101, 2024, 10, 1, 0, 1, 1, 15.5, 18.2, 67, 12.0, 3);

INSERT INTO Reviews (review_id, user_id, bike_id, rating, comment, review_date)
VALUES
(1, 1, 101, 4, 'Great bike for off-road trails!', '2024-03-29 12:30:00');

INSERT INTO Admins (username, password, email, phone_number)
VALUES ('admin1', 'adminpass', 'admin1@example.com', '+1122334455');
