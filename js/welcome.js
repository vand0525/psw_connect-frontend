import { configureAuth0, handleAuthRedirect } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  await configureAuth0();
  const user = await handleAuthRedirect();

  if (user) {
    document.getElementById(
      "welcome-message"
    ).innerText = `Welcome, ${user.name}!`;
  }
});
