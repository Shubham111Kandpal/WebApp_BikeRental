# Use the official MySQL 8.0 image as base
FROM mysql:8.0

# Set environment variables
ENV MYSQL_DATABASE=mydatabase \
    MYSQL_ROOT_PASSWORD=mysecretpassword

# Optionally, if you have SQL initialization scripts, copy them to a directory in the image
# COPY ./sql-scripts/ /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306

# Define the entry point
CMD ["mysqld"]
