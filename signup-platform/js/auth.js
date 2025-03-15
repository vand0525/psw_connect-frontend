document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const clientButton = document.getElementById('signup-client');
    const pswButton = document.getElementById('signup-psw');

    clientButton.addEventListener('click', function() {
        window.location.href = 'client/signup-step1.html';
    });

    pswButton.addEventListener('click', function() {
        window.location.href = 'psw/signup-step1.html';
    });
});