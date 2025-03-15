let auth0Client = null;

export async function configureAuth0() {
  if (auth0Client) return auth0Client;
  
  auth0Client = await createAuth0Client({
    domain: 'your-auth0-domain.auth0.com', // Replace with your Auth0 domain
    clientId: 'your-client-id', // Replace with your Auth0 client ID
    authorizationParams: {
      redirect_uri: window.location.origin + '/welcome.html'
    }
  });
  
  return auth0Client;
}

export async function loginWithAuth0(userType) {
  if (!auth0Client) {
    await configureAuth0();
  }

  // Store the user type (client or psw) in sessionStorage
  if (userType) {
    sessionStorage.setItem("userType", userType);
  }

  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: "http://127.0.0.1:5500/welcome.html",
    },
  });
}

export async function setupProfile(userType) {
  console.log(`Setting up profile for ${userType}`);
  
  // Store the user type (client or psw) in localStorage
  if (userType) {
    localStorage.setItem("userType", userType);
  }
  
  // Redirect to profile setup page
  window.location.href = `/profile-setup.html?userType=${userType}`;
}

export async function handleAuthRedirect() {
  if (!auth0Client) {
    await configureAuth0();
  }

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
  }

  const user = await auth0Client.getUser();

  if (user) {
    // Check if the user has a profile set up by making a request to your API
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${await auth0Client.getTokenSilently()}`
        }
      });

      if (response.status === 404) {
        // No profile exists, redirect to profile setup
        const userType = sessionStorage.getItem("userType") || "unassigned";
        window.location.href = `/profile-setup.html?userType=${userType}`;
        return null;
      }

      // If we have a profile, return the user
      const userProfile = await response.json();
      return { ...user, profile: userProfile };
    } catch (error) {
      console.error("Error checking user profile:", error);
      return user;
    }
  }

  return user;
}

export async function logout() {
  if (!auth0Client) {
    await configureAuth0();
  }
  
  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

// Make auth functions available globally
window.setupProfile = setupProfile;
window.loginWithAuth0 = loginWithAuth0;
window.logout = logout;