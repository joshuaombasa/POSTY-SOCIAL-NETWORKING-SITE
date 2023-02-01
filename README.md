# POSTY-SOCIAL-NETWORKING-SITE
Express + MySQL User Management Application
This is a Node.js application using the express framework and the MySQL library to manage users. The application provides features for users to sign up and log in to the application.

Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Prerequisites
Node.js
npm
MySQL Server
Installing
Clone the repository and run the following commands in the root directory of the project:

npm install

This will install all the required dependencies for the project.

Next, create a MySQL database and update the connection configuration object in the index.js file with your MySQL credentials.
const connection = mysql.createConnection( {
    host: 'localhost',
    user:'root',
    password: '',
    database: 'posty'
}) 

Running the Application
To start the application, run the following command:
Running the Application
To start the application, run the following command:

node index.js
The application should now be running on http://localhost:4000.

Features
User sign up
User login
Error handling for existing users and password mismatches


