# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port specified by the environment variable
EXPOSE 8004

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8004"]
