# Signup Platform

## Overview
The Signup Platform is a web application designed to facilitate the signup process for clients seeking care services and Personal Support Workers (PSWs) looking to provide those services. The application features a multi-step signup process that ensures users provide all necessary information in an intuitive manner.

## Project Structure
The project is organized into the following directories and files:

- **assets/**: Contains icons and images used throughout the application.
  - **icons/**: Icon files.
  - **images/**: Image files.
  
- **css/**: Contains stylesheets for the application.
  - **main.css**: Main styles for the application.
  - **auth.css**: Styles specific to authentication pages (login and signup).
  - **client.css**: Styles specific to client signup and dashboard pages.
  - **psw.css**: Styles specific to PSW signup and dashboard pages.

- **js/**: Contains JavaScript files for application functionality.
  - **main.js**: Entry point for general application logic and event listeners.
  - **auth.js**: Manages authentication processes, including login and signup.
  - **client-signup.js**: Handles the multi-step signup process for clients.
  - **psw-signup.js**: Manages the signup process for PSWs.
  - **dashboard.js**: Handles functionality for client and PSW dashboards.

- **pages/**: Contains HTML files for different parts of the application.
  - **index.html**: Main landing page.
  - **auth/**: Contains login and signup pages.
    - **login.html**: Login form.
    - **signup.html**: Initial signup form for user type selection.
  - **client/**: Contains pages for client signup and dashboard.
    - **signup-step1.html**: First step of client signup.
    - **signup-step2.html**: Second step of client signup.
    - **signup-step3.html**: Final step of client signup.
    - **create-task.html**: Page for clients to create and post task cards.
    - **dashboard.html**: Client dashboard.
  - **psw/**: Contains pages for PSW signup and dashboard.
    - **signup-step1.html**: First step of PSW signup.
    - **signup-step2.html**: Second step of PSW signup.
    - **browse-tasks.html**: Page for PSWs to browse client tasks.
    - **dashboard.html**: PSW dashboard.

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the project in your preferred code editor.
3. Open `index.html` in a web browser to view the application.
4. Ensure that all assets are correctly linked in the HTML files.

## Features
- Multi-step signup process for both clients and PSWs.
- Task card generation for clients to specify their care needs.
- Specialization selection for PSWs to tailor their services.
- Dashboards for clients and PSWs to manage their tasks and profiles.

## Future Enhancements
- Implement user authentication and session management.
- Add a database to store user information and task cards.
- Enhance the UI/UX for better user engagement.

## License
This project is licensed under the MIT License.