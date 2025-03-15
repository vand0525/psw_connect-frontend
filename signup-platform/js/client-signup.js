// This file handles the multi-step signup process for clients, including form validation and task card generation.

document.addEventListener('DOMContentLoaded', function() {
    const step1Form = document.getElementById('client-signup-step1');
    const step2Form = document.getElementById('client-signup-step2');
    const step3Form = document.getElementById('client-signup-step3');
    const taskCard = document.getElementById('task-card');

    // Step 1: Handle username, password, and address submission
    step1Form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = step1Form.username.value;
        const password = step1Form.password.value;
        const address = step1Form.address.value;

        // Store data in sessionStorage
        sessionStorage.setItem('clientUsername', username);
        sessionStorage.setItem('clientPassword', password);
        sessionStorage.setItem('clientAddress', address);

        // Redirect to Step 2
        window.location.href = 'signup-step2.html';
    });

    // Step 2: Handle age group and care type selection
    step2Form.addEventListener('submit', function(event) {
        event.preventDefault();
        const ageGroup = step2Form.ageGroup.value;
        const careTypes = Array.from(step2Form.careType).filter(input => input.checked).map(input => input.value);
        const careDuration = step2Form.careDuration.value;

        // Store data in sessionStorage
        sessionStorage.setItem('clientAgeGroup', ageGroup);
        sessionStorage.setItem('clientCareTypes', JSON.stringify(careTypes));
        sessionStorage.setItem('clientCareDuration', careDuration);

        // Redirect to Step 3
        window.location.href = 'signup-step3.html';
    });

    // Step 3: Confirm task card details and post
    step3Form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = sessionStorage.getItem('clientUsername');
        const address = sessionStorage.getItem('clientAddress');
        const ageGroup = sessionStorage.getItem('clientAgeGroup');
        const careTypes = JSON.parse(sessionStorage.getItem('clientCareTypes'));
        const careDuration = sessionStorage.getItem('clientCareDuration');

        // Generate task card
        taskCard.innerHTML = `
            <h3>Task Card</h3>
            <p>Username: ${username}</p>
            <p>Address: ${address}</p>
            <p>Age Group: ${ageGroup}</p>
            <p>Care Types: ${careTypes.join(', ')}</p>
            <p>Care Duration: ${careDuration}</p>
        `;

        // Optionally, you can add functionality to post the task card to the server here

        // Redirect to create task page or dashboard
        // window.location.href = 'create-task.html'; // Uncomment to redirect
    });
});