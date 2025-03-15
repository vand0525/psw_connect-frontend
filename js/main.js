import { setupProfile } from './auth.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  // Initialize checkbox functionality for "Other" fields
  const otherClientCheckbox = document.getElementById('other-client');
  const otherPswCheckbox = document.getElementById('other-psw');
  
  if (otherClientCheckbox) {
    otherClientCheckbox.addEventListener('change', function() {
      const otherField = document.getElementById('other-client-field');
      if (otherField) {
        otherField.style.display = this.checked ? 'block' : 'none';
      }
    });
  }
  
  if (otherPswCheckbox) {
    otherPswCheckbox.addEventListener('change', function() {
      const otherField = document.getElementById('other-psw-field');
      if (otherField) {
        otherField.style.display = this.checked ? 'block' : 'none';
      }
    });
  }
  
  // Set up profile selection buttons
  const clientButton = document.getElementById('profile-client-button');
  const pswButton = document.getElementById('profile-psw-button');
  
  if (clientButton) {
    clientButton.addEventListener('click', function() {
      localStorage.setItem('userType', 'client');
      setupProfile('client');
    });
  }
  
  if (pswButton) {
    pswButton.addEventListener('click', function() {
      localStorage.setItem('userType', 'psw');
      setupProfile('psw');
    });
  }
  
  // Set up the dashboard buttons
  const dashboardButton = document.getElementById('goto-dashboard');
  if (dashboardButton) {
    dashboardButton.addEventListener('click', function() {
      const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType') || 'client';
      const dashboardPath = userType === 'psw' ? '/views/psw/dashboard.html' : '/views/client/dashboard.html';
      window.location.href = dashboardPath;
    });
  }
  
  const additionalDashboardButton = document.getElementById('goto-dashboard-button');
  if (additionalDashboardButton) {
    additionalDashboardButton.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
    });
  }
  
  // Set up cancel button in signup
  const cancelSignupButton = document.querySelector('.button.button-outline');
  if (cancelSignupButton && !cancelSignupButton.id) {
    cancelSignupButton.addEventListener('click', function() {
      window.location.reload();
    });
  }
  
  // Function to show the right preference section when reaching step 3
  const showRightPreferenceSection = function() {
    const userType = localStorage.getItem('userType');
    const clientSection = document.getElementById('client-preferences-section');
    const pswSection = document.getElementById('psw-preferences-section');
    
    if (userType === 'client') {
      if (clientSection) clientSection.classList.remove('hidden');
      if (pswSection) pswSection.classList.add('hidden');
    } else if (userType === 'psw') {
      if (pswSection) pswSection.classList.remove('hidden');
      if (clientSection) clientSection.classList.add('hidden');
    }
  };
  
  // Add to your existing step navigation logic
  const nextButtons = document.querySelectorAll('.next-step-button');
  if (nextButtons.length > 0) {
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        // If moving to step 3, show the appropriate section
        const currentStep = parseInt(document.querySelector('#step-indicator')?.textContent.split(' ')[1]);
        if (currentStep === 2) { // Moving from step 2 to step 3
          showRightPreferenceSection();
        }
      });
    });
  }
}