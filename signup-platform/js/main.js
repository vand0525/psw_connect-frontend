// This file contains the main JavaScript functionality for the signup platform application.

document.addEventListener('DOMContentLoaded', function() {
    const signupButtons = document.querySelectorAll('.signup-button');

    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userType = this.dataset.userType; // Assuming buttons have data-user-type attribute

            if (userType === 'client') {
                window.location.href = 'pages/client/signup-step1.html';
            } else if (userType === 'psw') {
                window.location.href = 'pages/psw/signup-step1.html';
            }
        });
    });
});