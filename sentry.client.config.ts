// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// ---- Safe toast (does NOT crash Sentry) ----
let toastShown = false;

function showAdblockToast() {
  if (toastShown) return;
  toastShown = true;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "999999";
  container.style.padding = "14px 20px";
  container.style.borderRadius = "10px";
  container.style.background = "#ef4444";
  container.style.color = "white";
  container.style.fontSize = "15px";
  container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  container.style.maxWidth = "320px";
  container.style.lineHeight = "1.4";
  container.textContent =
    "Unable to send bug report. Add-blocker or Brave Shields may be blocking Sentry.";

  document.body.appendChild(container);

  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transition = "opacity 0.3s ease";
    setTimeout(() => container.remove(), 300);
  }, 5000);
}

// ---- Sentry Init ----
Sentry.init({
  dsn: "https://06c68752406fa646ab55a02543e28eef@o4510403487465472.ingest.us.sentry.io/4510403489497088",

  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",

      // SAFE — This callback never crashes
      onSubmitError() {
        showAdblockToast();
      },
    }),
  ],

  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});
