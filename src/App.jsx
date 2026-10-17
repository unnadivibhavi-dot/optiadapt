
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./services/firebase";

import {
  loginUser,
  registerUser,
  logoutUser,
} from "./services/authService";

import Dashboard from "./pages/Dashboard";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check if a user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setChecking(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle Login and Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }

      setPassword("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMessage("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        setMessage("Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Please enter a valid email address.");
      } else if (error.code === "auth/invalid-credential") {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setMessage("");

    try {
      await logoutUser();
      setEmail("");
      setPassword("");
      setIsRegister(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed. Please try again.");
    }
  };

  // Shared page styles
  const page = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#081426",
    color: "#f1f7ff",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const card = {
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    background: "#132743",
    border: "1px solid #28506a",
    borderRadius: "20px",
    textAlign: "center",
  };

  const field = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #456078",
    background: "#081426",
    color: "#ffffff",
    boxSizing: "border-box",
  };

  const button = {
    width: "100%",
    padding: "14px",
    background: "#42e5e8",
    color: "#081426",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  // Loading Screen
  if (checking) {
    return (
      <main style={page}>
        <p>Loading OptiAdapt...</p>
      </main>
    );
  }

  // Dashboard after successful Login
  if (user) {
    return (
      <>
        <Dashboard />

        <button
          type="button"
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "90px",
            right: "24px",
            zIndex: 10,
            padding: "10px 20px",
            borderRadius: "8px",
            background: "#42e5e8",
            color: "#081426",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>

        {message && (
          <p
            role="alert"
            style={{
              position: "fixed",
              top: "145px",
              right: "24px",
              color: "#ff9292",
              zIndex: 10,
              background: "#132743",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {message}
          </p>
        )}
      </>
    );
  }

  // Login and Register Screen
  return (
    <main style={page}>
      <section style={card}>
        <h1
          style={{
            color: "#42e5e8",
            fontSize: "38px",
            marginBottom: "15px",
          }}
        >
          OptiAdapt
        </h1>

        <p
          style={{
            color: "#b9cddd",
            marginBottom: "30px",
          }}
        >
          Beyond the Lens. Into Better Vision.
        </p>

        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "25px" }}>
            {isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>

          <input
            style={field}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            style={field}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              isRegister
                ? "new-password"
                : "current-password"
            }
            minLength={6}
            required
          />

          {message && (
            <p
              role="alert"
              style={{
                color: "#ff9292",
                marginBottom: "15px",
              }}
            >
              {message}
            </p>
          )}

          <button
            style={button}
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>

          <p
            style={{
              marginTop: "25px",
              color: "#b9cddd",
            }}
          >
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#42e5e8",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isRegister
              ? "Login here"
              : "Register here"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
