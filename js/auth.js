let auth0Client;

export async function configureAuth0() {
  const response = await fetch("/auth_config.json");
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: config.redirectUri,
    },
  });
}

export async function signUpWithAuth0() {
  if (!auth0Client) {
    await configureAuth0();
  }

  await auth0Client.loginWithRedirect({
    authorizationParams: {
      screen_hint: "signup",
      redirect_uri: "http://127.0.0.1:5500/welcome.html",
    },
  });
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
  return user;
}
