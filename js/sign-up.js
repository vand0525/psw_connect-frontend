// Array of step IDs in order
const signUpSteps = ['signup-step-1', 'signup-step-2', 'signup-step-3', 'signup-completion'];
let currentStepIndex = -1; // -1 means no step is active yet

/**
 * Initialize the sign-up functionality
 */
export function initSignUp() {
  // Get both sign-up buttons and add click event listeners
  const clientSignUpButton = document.getElementById('signup-button');
  const pswSignUpButton = document.getElementById('signup-psw-button');
  
  if (clientSignUpButton) {
    clientSignUpButton.addEventListener('click', () => {
      // Store the user type in session storage
      sessionStorage.setItem('userType', 'client');
      startSignUp();
    });
  }
  
  if (pswSignUpButton) {
    pswSignUpButton.addEventListener('click', () => {
      // Store the user type in session storage
      sessionStorage.setItem('userType', 'psw');
      startSignUp();
    });
  }
  
  // Set up navigation buttons for each step
  setupStepNavigation();
  
  // Setup validation listeners
  setupEmailValidation();
  setupPostalCodeValidation();
  
  // Initialize with all sign-up steps hidden
  hideAllSignUpSteps();
}

/**
 * Set up event listeners for step navigation buttons
 */
function setupStepNavigation() {
  // Set up next buttons
  document.querySelectorAll('.next-step-button').forEach(button => {
    button.addEventListener('click', () => {
      if (validateCurrentStep()) {
        nextStep();
      }
    });
  });

  // Set up previous buttons
  document.querySelectorAll('.prev-step-button').forEach(button => {
    button.addEventListener('click', previousStep);
  });
}

/**
 * Validate form fields in the current step
 */
function validateCurrentStep() {
  // Basic validation - can be enhanced based on specific requirements
  const currentStepId = signUpSteps[currentStepIndex];
  const currentStep = document.getElementById(currentStepId);
  
  if (!currentStep) return true;
  
  const requiredFields = currentStep.querySelectorAll('[required]');
  let isValid = true;
  
  // First validate all required fields
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  });
  
  // Special validation for email field if we're on step 1
  if (currentStepId === 'signup-step-1') {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    if (emailInput && emailInput.value.trim()) {
      // Check email format using regex
      const isEmailValid = validateEmail(emailInput.value);
      
      if (!isEmailValid) {
        isValid = false;
        emailInput.classList.add('error');
        if (emailError) {
          emailError.classList.remove('hidden');
        }
      } else {
        emailInput.classList.remove('error');
        if (emailError) {
          emailError.classList.add('hidden');
        }
      }
    }
  }
  
  // Special validation for postal code if we're on step 2
  if (currentStepId === 'signup-step-2') {
    const postalCodeInput = document.getElementById('postal-code');
    const postalCodeError = document.getElementById('postal-code-error');
    
    if (postalCodeInput && postalCodeInput.value.trim()) {
      // Check postal code format
      const isPostalCodeValid = validatePostalCode(postalCodeInput.value);
      
      if (!isPostalCodeValid) {
        isValid = false;
        postalCodeInput.classList.add('error');
        if (postalCodeError) {
          postalCodeError.classList.remove('hidden');
        }
      } else {
        postalCodeInput.classList.remove('error');
        if (postalCodeError) {
          postalCodeError.classList.add('hidden');
        }
      }
    }
  }
  
  // Validation for step 3 - check if at least one checkbox is selected
  if (currentStepId === 'signup-step-3') {
    const userType = localStorage.getItem('userType');
    let checkboxSelector;
    
    if (userType === 'client') {
      checkboxSelector = 'input[name="care-needs"]:checked';
    } else if (userType === 'psw') {
      checkboxSelector = 'input[name="specializations"]:checked';
    }
    
    if (checkboxSelector) {
      const selectedCheckboxes = currentStep.querySelectorAll(checkboxSelector);
      if (selectedCheckboxes.length === 0) {
        isValid = false;
        
        // Show an error message if none selected
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.id = 'checkbox-error';
        errorMessage.textContent = 'Please select at least one option';
        
        // Remove any existing error message first
        const existingError = document.getElementById('checkbox-error');
        if (existingError) existingError.remove();
        
        const preferencesSection = document.querySelector(
          userType === 'client' ? '#client-preferences-section' : '#psw-preferences-section'
        );
        
        if (preferencesSection) {
          preferencesSection.querySelector('.form-intro').after(errorMessage);
        }
      } else {
        // Remove error message if it exists
        const existingError = document.getElementById('checkbox-error');
        if (existingError) existingError.remove();
      }
    }
  }
  
  return isValid;
}

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate Canadian postal code format (A1A 1A1)
 * @param {string} postalCode - Postal code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePostalCode(postalCode) {
  // Remove any spaces and convert to uppercase
  const cleanPostalCode = postalCode.trim().toUpperCase().replace(/\s+/g, '');
  
  // Canadian postal code format: A1A1A1
  const postalCodePattern = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\d[ABCEGHJKLMNPRSTVWXYZ]\d$/;
  return postalCodePattern.test(cleanPostalCode);
}

/**
 * Add real-time validation for email field
 */
function setupEmailValidation() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  
  if (emailInput && emailError) {
    // Check validation on input change
    emailInput.addEventListener('input', function() {
      if (this.value && !validateEmail(this.value)) {
        emailError.classList.remove('hidden');
        this.classList.add('error');
      } else {
        emailError.classList.add('hidden');
        this.classList.remove('error');
      }
    });
    
    // Also check on blur (when user leaves the field)
    emailInput.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        emailError.classList.remove('hidden');
        this.classList.add('error');
      }
    });
  }
}

/**
 * Add real-time validation for postal code field
 */
function setupPostalCodeValidation() {
  const postalCodeInput = document.getElementById('postal-code');
  const postalCodeError = document.getElementById('postal-code-error');
  
  if (postalCodeInput && postalCodeError) {
    // Format postal code as user types (e.g., A1A 1A1)
    postalCodeInput.addEventListener('input', function() {
      // Remove any non-alphanumeric characters
      let value = this.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      
      // Insert space after 3rd character if length > 3
      if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
      }
      
      // Limit to max length (7 characters including space)
      if (value.length > 7) {
        value = value.substring(0, 7);
      }
      
      this.value = value;
      
      // Validate if length is sufficient
      if (value.length >= 7) {
        if (!validatePostalCode(value)) {
          postalCodeError.classList.remove('hidden');
          this.classList.add('error');
        } else {
          postalCodeError.classList.add('hidden');
          this.classList.remove('error');
        }
      } else {
        postalCodeError.classList.add('hidden');
      }
    });
    
    // Validate on blur
    postalCodeInput.addEventListener('blur', function() {
      if (this.value && !validatePostalCode(this.value)) {
        postalCodeError.classList.remove('hidden');
        this.classList.add('error');
      } else {
        postalCodeError.classList.add('hidden');
        this.classList.remove('error');
      }
    });
  }
}

/**
 * Start the sign-up process
 */
function startSignUp() {
  currentStepIndex = 0;
  
  // Hide the selection page and show the signup container
  const selectionPage = document.getElementById('signup-selection');
  const signupContainer = document.getElementById('signup-container');
  
  if (selectionPage && signupContainer) {
    selectionPage.classList.add('hidden');
    signupContainer.classList.remove('hidden');
  }
  
  showCurrentStep();
  updateProgressIndicator();
}

/**
 * Show the current step of the sign-up process
 */
function showCurrentStep() {
  hideAllSignUpSteps();
  
  if (currentStepIndex >= 0 && currentStepIndex < signUpSteps.length) {
    const currentStepId = signUpSteps[currentStepIndex];
    const currentStep = document.getElementById(currentStepId);
    if (currentStep) {
      currentStep.classList.remove('hidden');
    }
  }
}

/**
 * Hide all sign-up steps
 */
function hideAllSignUpSteps() {
  signUpSteps.forEach(stepId => {
    const step = document.getElementById(stepId);
    if (step) {
      step.classList.add('hidden');
    }
  });
}

/**
 * Update the progress indicator for the sign-up process
 */
function updateProgressIndicator() {
  const progress = document.getElementById('signup-progress');
  if (progress) {
    const percentage = ((currentStepIndex + 1) / signUpSteps.length) * 100;
    progress.style.width = `${percentage}%`;
    progress.setAttribute('aria-valuenow', percentage);
  }
  
  const stepIndicator = document.getElementById('step-indicator');
  if (stepIndicator) {
    stepIndicator.textContent = `Step ${currentStepIndex + 1} of ${signUpSteps.length}`;
  }
}

/**
 * Move to the next step in the sign-up process
 */
function nextStep() {
  if (currentStepIndex < signUpSteps.length - 1) {
    currentStepIndex++;
    showCurrentStep();
    updateProgressIndicator();
    
    // Check if we've completed the final step before "completion"
    if (signUpSteps[currentStepIndex] === 'signup-completion') {
      submitRegistrationData();
    }
  }
}

/**
 * Move to the previous step in the sign-up process
 */
function previousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showCurrentStep();
    updateProgressIndicator();
  }
}

/**
 * Collect all form data and submit to the appropriate API endpoint
 */
function submitRegistrationData() {
  // Get user type from session storage
  const userType = sessionStorage.getItem('userType');
  
  // Create form data object
  const formData = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    age: document.getElementById('age').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: {
      street: document.getElementById('street-address').value,
      apartment: document.getElementById('apartment').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postalCode: document.getElementById('postal-code').value
    }
  };
  
  // Add user type specific data
  if (userType === 'client') {
    const careNeeds = Array.from(document.querySelectorAll('input[name="care-needs"]:checked'))
      .map(checkbox => checkbox.value);
    
    formData.careNeeds = careNeeds;
    
    if (careNeeds.includes('other')) {
      formData.otherNeeds = document.getElementById('other-client-needs').value;
    }
    
    formData.additionalInfo = document.getElementById('client-additional-info').value;
  } else if (userType === 'psw') {
    const specializations = Array.from(document.querySelectorAll('input[name="specializations"]:checked'))
      .map(checkbox => checkbox.value);
    
    formData.specializations = specializations;
    
    if (specializations.includes('other')) {
      formData.otherSpecializations = document.getElementById('other-psw-specializations').value;
    }
    
    formData.yearsExperience = document.getElementById('years-experience').value;
    formData.additionalInfo = document.getElementById('psw-additional-info').value;
  }
  
  // Determine the endpoint based on user type
  const endpoint = userType === 'psw' ? '/api/provider' : '/api/user';
  
  // Send the data to the API
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  })
  .then(data => {
    // Store user data in session storage for use in dashboard
    sessionStorage.setItem('userData', JSON.stringify(data));
    
    // Show success message for a short time before redirecting
    setTimeout(() => {
      // Redirect to the appropriate dashboard
      const dashboardPath = userType === 'psw' ? 
        '/psw/dashboard' : '/client/dashboard';
      window.location.href = dashboardPath;
    }, 2000);
  })
  .catch(error => {
    console.error('Error during registration:', error);
    // Show error message
    const completionMessage = document.querySelector('.completion-message');
    if (completionMessage) {
      completionMessage.innerHTML = `
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h2>Registration Failed</h2>
        <p>There was an error processing your registration. Please try again.</p>
        <button class="button button-default" onclick="window.location.reload()">
          <i class="fas fa-redo"></i> Try Again
        </button>
      `;
    }
  });
}