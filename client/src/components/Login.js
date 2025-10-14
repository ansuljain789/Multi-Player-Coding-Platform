import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import config from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        toast.success("Login successful");
        navigate("/"); // redirect to home
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background:
          "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        className="card text-light shadow-lg p-4"
        style={{
          width: "380px",
          borderRadius: "20px",
          background:
            "linear-gradient(145deg, rgba(20,25,40,0.95), rgba(30,35,55,0.9))",
          boxShadow: "0 0 20px rgba(0, 162, 255, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center mb-4">
          <h3
            className="fw-bold"
            style={{
              background:
                "linear-gradient(90deg, #00f5ff, #007bff, #9b51e0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Code Collaborator 🤖
          </h3>
          <p className="text-secondary mb-0">
            Log in to collaborate and code in real time
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold text-info">Email</label>
          <input
            type="email"
            className="form-control bg-dark text-light border-info"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold text-info">Password</label>
          <input
            type="password"
            className="form-control bg-dark text-light border-info"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn w-100 fw-semibold mt-2"
          style={{
            background:
              "linear-gradient(90deg, #007bff, #00f5ff, #9b51e0)",
            border: "none",
            color: "#fff",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #9b51e0, #00f5ff, #007bff)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #007bff, #00f5ff, #9b51e0)")
          }
          onClick={handleLogin}
        >
          🚀 Login
        </button>

        <div className="text-center mt-3">
          <small className="text-muted">
            New here?{" "}
            <a href="/register" className="text-info fw-semibold">
              Create an account
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
