# POSTY-SOCIAL-NETWORKING-SITE
Created using HTML,CSS and Javascript
This is a Node.js application using the express framework and the MySQL library. The application is listening on port 4000 and has the following routes:

The root route ("/") renders an "index" view.
The "/login" route displays a login form.
The "/login" route that is the target of a POST request from the login form.
The "/signup" route displays a sign-up form.
The "/signup" route that is the target of a POST request from the sign-up form.

The MySQL connection is established using the host, username, password and database name. In the "/signup" route, the submitted data from the sign-up form is processed, and the user's information is inserted into the "users" table if the passwords match. If the user already exists, the application displays an error message.
