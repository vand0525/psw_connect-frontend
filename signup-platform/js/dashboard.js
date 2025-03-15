// This file handles the functionality for the client and PSW dashboards, including displaying tasks and user information.

document.addEventListener('DOMContentLoaded', function() {
    const userType = localStorage.getItem('userType'); // Assume userType is stored in localStorage after signup
    const dashboardContainer = document.getElementById('dashboard-container');

    if (userType === 'client') {
        loadClientDashboard();
    } else if (userType === 'psw') {
        loadPSWDashboard();
    } else {
        // Redirect to signup or login if userType is not set
        window.location.href = '../auth/login.html';
    }

    function loadClientDashboard() {
        // Fetch and display client's posted tasks
        fetch('/api/client/tasks') // Example API endpoint
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>Status: ${task.status}</p>
                    `;
                    dashboardContainer.appendChild(taskElement);
                });
            })
            .catch(error => console.error('Error loading client tasks:', error));
    }

    function loadPSWDashboard() {
        // Fetch and display tasks available for PSWs
        fetch('/api/psw/tasks') // Example API endpoint
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>Client: ${task.clientName}</p>
                        <p>Status: ${task.status}</p>
                    `;
                    dashboardContainer.appendChild(taskElement);
                });
            })
            .catch(error => console.error('Error loading PSW tasks:', error));
    }
});