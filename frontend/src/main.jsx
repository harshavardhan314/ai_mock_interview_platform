import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const root = document.getElementById("root");

function renderConfigError(message) {
  ReactDOM.createRoot(root).render(
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "640px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Frontend configuration error</h1>
      <p style={{ lineHeight: 1.6, color: "#444" }}>{message}</p>
    </div>
  );
}

if (!clerkPubKey) {
  renderConfigError(
    "Missing VITE_CLERK_PUBLISHABLE_KEY. On Render, add this environment variable to the static site and trigger a new deploy (Vite reads env vars at build time)."
  );
} else if (!clerkPubKey.startsWith("pk_")) {
  renderConfigError("Invalid VITE_CLERK_PUBLISHABLE_KEY. Use the publishable key from Clerk Dashboard (starts with pk_test_ or pk_live_).");
} else {
  ReactDOM.createRoot(root).render(
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  );
}
