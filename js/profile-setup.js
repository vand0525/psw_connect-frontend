import { configureAuth0, logout } from "./auth.js";

// Array of step IDs in order
const profileSteps = [
  "profile-step-1",
  "profile-step-2",
  "profile-step-3",
  "profile-completion",
];
let currentStepIndex = 0; // Start at first step

document.addEventListener("DOMContentLoaded", async function () {
  // Get user type from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userType =
    urlParams.get("userType") || localStorage.getItem("userType") || "client";

  // Store user type in localStorage AND sessionStorage for consistency
  localStorage.setItem("userType", userType);
  sessionStorage.setItem("userType", userType); // Add this line
  console.log(`Profile setup initialized for ${userType}`);

  // Initialize profile setup UI
  initProfileSetup();
});

function initProfileSetup() {
  // Set up profile steps navigation
  setupStepNavigation();

  // Show the appropriate preference section based on user type
  showRightPreferenceSection();
  
  // Set up postal code validation - this was defined but never called
  setupPostalCodeValidation();

  // Show the first step
  showCurrentStep();

  // Set up cancel button
  setupCancelButton();
}

/**
 * Set up event listeners for step navigation buttons
 */
function setupStepNavigation() {
  document.querySelectorAll(".next-step-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (validateCurrentStep()) {
        nextStep();
      }
    });
  });

  document.querySelectorAll(".prev-step-button").forEach((button) => {
    button.addEventListener("click", previousStep);
  });

  // Set up the dashboard button on completion
  const dashboardButton = document.getElementById("goto-dashboard");
  if (dashboardButton) {
    dashboardButton.addEventListener("click", function () {
      const userType = localStorage.getItem("userType") || "client";
      const dashboardPath =
        userType === "psw"
          ? "/views/psw/dashboard.html"
          : "/views/client/dashboard.html";
      window.location.href = dashboardPath;
    });
  }
}

/**
 * Set up event listener for the cancel button
 */
function setupCancelButton() {
  const cancelButton = document.getElementById("cancel-profile-setup");
  if (cancelButton) {
    // Add event listener
    cancelButton.addEventListener("click", cancelProfileSetup);
  }
}

/**
 * Cancel profile setup and return to homepage
 */
function cancelProfileSetup() {
  // Clear any stored profile data
  sessionStorage.removeItem("userData");

  // Redirect to the homepage
  window.location.href = "/index.html";
}

/**
 * Validate form fields in the current step
 */
function validateCurrentStep() {
  const currentStepId = profileSteps[currentStepIndex];
  const currentStep = document.getElementById(currentStepId);
  if (!currentStep) return true;

  const requiredFields = currentStep.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add("error");
      // Add visible feedback
      const errorMsg = field.nextElementSibling?.classList.contains('error-message') ? 
        field.nextElementSibling : document.createElement('p');
      if (!field.nextElementSibling?.classList.contains('error-message')) {
        errorMsg.classList.add('error-message');
        errorMsg.textContent = "This field is required";
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
      }
    } else {
      field.classList.remove("error");
      if (field.nextElementSibling?.classList.contains('error-message')) {
        field.nextElementSibling.remove();
      }
    }
  });

  // Postal code validation for step 2
  if (currentStepId === "profile-step-2") {
    const postalCodeInput = document.getElementById("postal-code");
    const postalCodeError = document.getElementById("postal-code-error");
    if (postalCodeInput && postalCodeInput.value.trim()) {
      const isPostalCodeValid = validatePostalCode(postalCodeInput.value);
      if (!isPostalCodeValid) {
        isValid = false;
        postalCodeInput.classList.add("error");
        if (postalCodeError) postalCodeError.classList.remove("hidden");
      } else {
        postalCodeInput.classList.remove("error");
        if (postalCodeError) postalCodeError.classList.add("hidden");
      }
    }
  }

  // Validation for step 3 - check if at least one checkbox is selected
  if (currentStepId === "profile-step-3") {
    const userType = sessionStorage.getItem("userType");
    let checkboxSelector;

    if (userType === "client") {
      checkboxSelector = 'input[name="care-needs"]:checked';
    } else {
      checkboxSelector = 'input[name="specializations"]:checked';
    }

    if (checkboxSelector) {
      const selectedCheckboxes = currentStep.querySelectorAll(checkboxSelector);
      if (selectedCheckboxes.length === 0) {
        isValid = false;

        // Show an error message if none selected
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.id = "checkbox-error";
        errorMessage.textContent = "Please select at least one option";

        // Remove any existing error message first
        const existingError = document.getElementById("checkbox-error");
        if (existingError) existingError.remove();

        const preferencesSection = document.querySelector(
          userType === "client"
            ? "#client-preferences-section"
            : "#psw-preferences-section"
        );

        if (preferencesSection) {
          preferencesSection.querySelector(".form-intro").after(errorMessage);
        }
      } else {
        // Remove error message if it exists
        const existingError = document.getElementById("checkbox-error");
        if (existingError) existingError.remove();
      }
    }
  }

  // For debugging
  if (!isValid) {
    console.log(`Validation failed for step ${currentStepIndex + 1}`);
  }
  
  return isValid;
}

/**
 * Validate Canadian postal code format (A1A 1A1)
 */
function validatePostalCode(postalCode) {
  const cleanPostalCode = postalCode.trim().toUpperCase().replace(/\s+/g, "");
  const postalCodePattern =
    /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\d[ABCEGHJKLMNPRSTVWXYZ]\d$/;
  return postalCodePattern.test(cleanPostalCode);
}

/**
 * Add real-time validation for postal code field
 */
function setupPostalCodeValidation() {
  const postalCodeInput = document.getElementById("postal-code");
  const postalCodeError = document.getElementById("postal-code-error");

  if (postalCodeInput && postalCodeError) {
    postalCodeInput.addEventListener("input", function () {
      let value = this.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      if (value.length > 3)
        value = value.substring(0, 3) + " " + value.substring(3);
      if (value.length > 7) value = value.substring(0, 7);
      this.value = value;

      if (value.length >= 7) {
        if (!validatePostalCode(value)) {
          postalCodeError.classList.remove("hidden");
          this.classList.add("error");
        } else {
          postalCodeError.classList.add("hidden");
          this.classList.remove("error");
        }
      } else {
        postalCodeError.classList.add("hidden");
      }
    });

    postalCodeInput.addEventListener("blur", function () {
      if (this.value && !validatePostalCode(this.value)) {
        postalCodeError.classList.remove("hidden");
        this.classList.add("error");
      } else {
        postalCodeError.classList.add("hidden");
        this.classList.remove("error");
      }
    });
  }
}

/**
 * Show the current step of the profile setup process
 */
function showCurrentStep() {
  hideAllProfileSteps();
  if (currentStepIndex >= 0 && currentStepIndex < profileSteps.length) {
    document
      .getElementById(profileSteps[currentStepIndex])
      .classList.remove("hidden");
  }
  updateProgressIndicator();
}

/**
 * Hide all profile setup steps
 */
function hideAllProfileSteps() {
  profileSteps.forEach((stepId) => {
    const step = document.getElementById(stepId);
    if (step) step.classList.add("hidden");
  });
}

/**
 * Update the progress indicator for the profile setup process
 */
function updateProgressIndicator() {
  const progress = document.getElementById("profile-progress");
  if (progress) {
    const percentage =
      ((currentStepIndex + 1) / (profileSteps.length - 1)) * 100;
    progress.style.width = `${percentage}%`;
  }

  const stepIndicator = document.getElementById("step-indicator");
  if (stepIndicator) {
    stepIndicator.textContent = `Step ${currentStepIndex + 1} of ${
      profileSteps.length - 1
    }`;
  }
}

/**
 * Move to the next step in the profile setup process
 */
function nextStep() {
  if (currentStepIndex < profileSteps.length - 1) {
    currentStepIndex++;
    console.log(`Moving to step ${currentStepIndex + 1}`); // Add debugging

    // If moving to completion step, submit the data first
    if (profileSteps[currentStepIndex] === "profile-completion") {
      submitProfileData();
      console.log("Profile data submitted, showing completion step");
    }

    showCurrentStep();

    // If we're moving to step 3, make sure the right section is shown
    if (profileSteps[currentStepIndex] === "profile-step-3") {
      showRightPreferenceSection();
    }
  }
}

/**
 * Move to the previous step in the profile setup process
 */
function previousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
  }
  showCurrentStep();
}

function showRightPreferenceSection() {
  // Use localStorage consistent with initialization
  const userType = localStorage.getItem("userType");
  console.log(`Showing preferences for user type: ${userType}`);
  const clientSection = document.getElementById("client-preferences-section");
  const pswSection = document.getElementById("psw-preferences-section");
  if (userType === "client") {
    if (clientSection) clientSection.classList.remove("hidden");
    if (pswSection) pswSection.classList.add("hidden");
  } else if (userType === "psw" || userType === "provider") {
    if (pswSection) pswSection.classList.remove("hidden");
    if (clientSection) clientSection.classList.add("hidden");
  }
}

function submitProfileData() {
  // Get user type from session storage
  const userType = sessionStorage.getItem("userType");
  const formData = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    age: document.getElementById("age").value,
    phone: document.getElementById("phone").value,
    address: {
      city: document.getElementById("city").value,
      street: document.getElementById("street-address").value,
      postalCode: document.getElementById("postal-code").value,
    },
    userType: userType,
  };

  if (userType === "client") {
    const careNeeds = Array.from(
      document.querySelectorAll('input[name="care-needs"]:checked')
    ).map((checkbox) => checkbox.value);

    formData.careNeeds = careNeeds;

    if (careNeeds.includes("other")) {
      formData.otherNeeds = document.getElementById("other-client-needs").value;
    }

    formData.additionalInfo = document.getElementById(
      "client-additional-info"
    ).value;
  } else {
    const specializations = Array.from(
      document.querySelectorAll('input[name="specializations"]:checked')
    ).map((checkbox) => checkbox.value);

    formData.specializations = specializations;

    if (specializations.includes("other")) {
      formData.otherSpecializations = document.getElementById(
        "other-psw-specializations"
      ).value;
    }

    formData.yearsExperience =
      document.getElementById("years-experience").value;
    formData.additionalInfo = document.getElementById(
      "psw-additional-info"
    ).value;
  }

  // Determine the endpoint based on user type
  const endpoint =
    userType === "psw" || userType === "provider"
      ? "/api/providers"
      : "/api/users";

  // For the purpose of this demo, store in sessionStorage instead of sending to API
  // In a production app, you would uncomment the fetch code below
  sessionStorage.setItem("userData", JSON.stringify(formData));
  console.log("Profile data saved:", formData);

  /* Uncomment for API integration
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Profile creation failed');
    }
    return response.json();
  })
  .then(data => {
    // Store user data in session storage for use in dashboard
    sessionStorage.setItem('userData', JSON.stringify(data));
  })
  .catch(error => {
    console.error('Error during profile creation:', error);
    // Show error message (optional)
  });
  */
}

// Make other logic for showing/hiding "other" fields
document.addEventListener("DOMContentLoaded", function () {
  const otherClientCheckbox = document.getElementById("other-client");
  const otherPswCheckbox = document.getElementById("other-psw");

  if (otherClientCheckbox) {
    otherClientCheckbox.addEventListener("change", function () {
      const otherField = document.getElementById("other-client-field");
      if (otherField) {
        otherField.style.display = this.checked ? "block" : "none";
      }
    });
  }

  if (otherPswCheckbox) {
    otherPswCheckbox.addEventListener("change", function () {
      const otherField = document.getElementById("other-psw-field");
      if (otherField) {
        otherField.style.display = this.checked ? "block" : "none";
      }
    });
  }
});
