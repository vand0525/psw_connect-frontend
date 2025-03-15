import { initSignUp } from './sign-up.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  // Initialize sign-up functionality
  initSignUp();
  
  // Any other initialization code for the main application can go here
  
  // Show/hide "Other" fields when checkbox is clicked
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
  
  // Show appropriate preference section based on user type
  const clientButton = document.getElementById('signup-button');
  const pswButton = document.getElementById('signup-psw-button');
  
  if (clientButton && pswButton) {
    clientButton.addEventListener('click', function() {
      // When we reach step 3, show client preferences and hide PSW preferences
      localStorage.setItem('userType', 'client');
    });
    
    pswButton.addEventListener('click', function() {
      // When we reach step 3, show PSW preferences and hide client preferences
      localStorage.setItem('userType', 'psw');
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