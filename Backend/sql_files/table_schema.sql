CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    credit_card_info VARCHAR(255),
    registration_date DATETIME,
    last_login DATETIME
);

CREATE TABLE Bikes (
    bike_id INT PRIMARY KEY,
    model VARCHAR(255),
    bike_status VARCHAR(50),
    current_location VARCHAR(255),
    bike_condition VARCHAR(50),
    price_per_hour DECIMAL(10, 2),
    last_maintenance_date DATE,
    maintenance_history TEXT
);


CREATE TABLE Rentals (
    rental_id INT PRIMARY KEY,
    id INT,
    user_id INT,
    bike_id INT,
    year INT,
    hour INT,
    season INT,
    holiday BOOLEAN,
    workingday BOOLEAN,
    weather INT,
    temp DECIMAL(5, 2),
    atemp DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    windspeed DECIMAL(5, 2),
    count INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (bike_id) REFERENCES Bikes(bike_id)
);

CREATE TABLE Reviews (
    review_id INT PRIMARY KEY,
    user_id INT,
    bike_id INT,
    rating INT,
    comment TEXT,
    review_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (bike_id) REFERENCES Bikes(bike_id)
);

CREATE TABLE Admins (
    admin_id INT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20)
);

