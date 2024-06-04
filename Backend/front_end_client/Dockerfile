# Use a base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the frontend files from the host to the container
COPY . .

# Expose port 80 to the outside world
EXPOSE 8000

# Start the nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]