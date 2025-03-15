document.addEventListener('DOMContentLoaded', init);

function init() {
  // Get the sign-up button and add click event listener
  const signUpButton = document.getElementById('signup-button');
  if (signUpButton) {
    signUpButton.addEventListener('click', startSignUp);
  }
  
  // Set up navigation buttons for each step
  setupStepNavigation();
  
  // Initialize with all sign-up steps hidden
  hideAllSignUpSteps();
}

// Array of step IDs in order
const signUpSteps = ['signup-step-1', 'signup-step-2', 'signup-step-3', 'signup-completion'];
let currentStepIndex = -1; // -1 means no step is active yet

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

function validateCurrentStep() {
  // Basic validation - can be enhanced based on specific requirements
  const currentStepId = signUpSteps[currentStepIndex];
  const currentStep = document.getElementById(currentStepId);
  
  if (!currentStep) return true;
  
  const requiredFields = currentStep.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  });
  
  return isValid;
}

function startSignUp() {
  currentStepIndex = 0;
  showCurrentStep();
  updateProgressIndicator();
}

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

function hideAllSignUpSteps() {
  signUpSteps.forEach(stepId => {
    const step = document.getElementById(stepId);
    if (step) {
      step.classList.add('hidden');
    }
  });
}

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

function nextStep() {
  if (currentStepIndex < signUpSteps.length - 1) {
    currentStepIndex++;
    showCurrentStep();
    updateProgressIndicator();
  }
}

function previousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showCurrentStep();
    updateProgressIndicator();
  }
}