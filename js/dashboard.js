/**
 * Dashboard functionality for CareConnect platform
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set user name from session storage
  setUserDetails();
  
  // Set user location (could be replaced with geolocation API)
  setUserLocation();
  
  // Initialize dropdown functionality
  initDropdowns();
});

/**
 * Set user name and other details from session storage
 */
function setUserDetails() {
  const userNameElement = document.getElementById('user-name');
  
  // Try to get user data from session storage
  try {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    if (userData && userData.firstName) {
      if (userNameElement) {
        userNameElement.textContent = `${userData.firstName} ${userData.lastName || ''}`;
      }
      
      // If we have a user avatar image, set it
      const userAvatar = document.querySelector('.user-avatar');
      if (userAvatar && userData.profileImage) {
        userAvatar.innerHTML = `<img src="${userData.profileImage}" alt="Profile">`;
      }
    } else {
      // Fallback if no user data
      if (userNameElement) {
        userNameElement.textContent = 'User';
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    if (userNameElement) {
      userNameElement.textContent = 'User';
    }
  }
}

/**
 * Set user location using browser geolocation API
 */
function setUserLocation() {
  const locationElement = document.getElementById('user-location');
  if (!locationElement) return;
  
  // Try to get location from stored user data
  try {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    if (userData?.address?.city && userData?.address?.province) {
      locationElement.textContent = `${userData.address.city}, ${userData.address.province}`;
      return;
    }
    
    // Use browser geolocation if we don't have stored location data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords;
            // Use a reverse geocoding service like Nominatim (OpenStreetMap)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || '';
              const province = data.address.state || '';
              locationElement.textContent = city && province ? `${city}, ${province}` : 'Location found';
            } else {
              locationElement.textContent = 'Ottawa, ON'; // Fallback
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            locationElement.textContent = 'Ottawa, ON'; // Fallback
          }
        },
        error => {
          console.error('Geolocation error:', error);
          locationElement.textContent = 'Ottawa, ON'; // Fallback
        }
      );
    } else {
      // Fallback to a default location if geolocation is not available
      locationElement.textContent = 'Ottawa, ON';
    }
  } catch (error) {
    console.error('Error setting location:', error);
    locationElement.textContent = 'Location unavailable';
  }
}

/**
 * Initialize dropdown functionality
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Toggle the dropdown menu
      menu.classList.toggle('show');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(menu => menu.classList.remove('show'));
  });
}
