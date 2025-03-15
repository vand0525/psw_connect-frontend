// This file manages the signup process for PSWs, including specialization selection and browsing client tasks.

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('psw-signup-form');
    const specializationSelect = document.getElementById('specialization');
    const nextButton = document.getElementById('next-button');

    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const address = document.getElementById('address').value;
        const specialization = specializationSelect.value;

        if (username && password && address && specialization) {
            // Store the PSW data in local storage or send it to the server
            localStorage.setItem('pswData', JSON.stringify({
                username: username,
                password: password,
                address: address,
                specialization: specialization
            }));

            // Redirect to the browse tasks page
            window.location.href = 'browse-tasks.html';
        } else {
            alert('Please fill in all fields.');
        }
    });
});