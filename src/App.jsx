
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./services/firebase";

import {
  loginUser,
  registerUser,
  logoutUser,
} from "./services/authService";

import Dashboard from "./pages/Dashboard";
import CustomerCases from "./pages/CustomerCases";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Dashboard or Customer Cases
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isRegister) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }

      setPassword("");
      setCurrentPage("dashboard");

    } catch (error) {
      console.error("Authentication error:", error);

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

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();

      setEmail("");
      setPassword("");
      setIsRegister(false);
      setCurrentPage("dashboard");
      setMessage("");

    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Logout failed. Please try again.");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "#081426",
    color: "#f1f7ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    background: "#132743",
    border: "1px solid #28506a",
    borderRadius: "20px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #456078",
    background: "#081426",
    color: "#ffffff",
  };

  const buttonStyle = {
    padding: "12px 20px",
    background: "#42e5e8",
    color: "#081426",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  // Loading screen
  if (checking) {
    return (
      <main style={pageStyle}>
        <p>Loading OptiAdapt...</p>
      </main>
    );
  }

  // Logged-in user
  if (user) {
    return (
      <div style={{ background: "#081426", minHeight: "100vh" }}>

        <nav
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            flexWrap: "wrap",
            padding: "12px 24px",
            background: "#10213a",
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            style={buttonStyle}
            onClick={() => setCurrentPage("cases")}
          >
            Customer Cases
          </button>

          <button
            style={{
              ...buttonStyle,
              background: "#233c57",
              color: "#ffffff",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>

        {message && (
          <p role="alert" style={{ color: "#ff9292", padding: "12px" }}>
            {message}
          </p>
        )}

        {currentPage === "dashboard" ? (
          <Dashboard />
        ) : (
          <CustomerCases />
        )}

      </div>
    );
  }

  // Login and Register
  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1 style={{ color: "#42e5e8", fontSize: "38px" }}>
          OptiAdapt
        </h1>

        <p style={{ color: "#b9cddd", margin: "20px 0" }}>
          Beyond the Lens. Into Better Vision.
        </p>

        <h2 style={{ marginBottom: "25px" }}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              isRegister ? "new-password" : "current-password"
            }
            minLength={6}
            required
          />

          {message && (
            <p role="alert" style={{ color: "#ff9292", marginBottom: "15px" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...buttonStyle, width: "100%" }}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "24px", color: "#b9cddd" }}>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>

        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#42e5e8",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
            setPassword("");
          }}
        >
          {isRegister ? "Login here" : "Register here"}
        </button>
      </section>
    </main>
  );
}

export default App;
