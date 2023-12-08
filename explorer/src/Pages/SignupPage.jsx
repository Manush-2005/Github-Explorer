import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { app } from "../Firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const Auth = getAuth(app);

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  const createuser = () => {
    console.log(email, password);
    createUserWithEmailAndPassword(Auth, email, password).then((result) => {
      // window.location.href = "/login";
      console.log(result);
    });
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src="https://github.githubassets.com/images/spinners/octocat-spinner-128.gif"
            alt="Loading..."
          />
          <p>GitHub Explorer</p>
        </div>
      </div>
    );
  }

  return (
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="form-container">
            <h2 class="text-center mb-4">Signup</h2>
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </div>
              <button
                type="button"
                class="btn btn-primary btn-lg btn-block"
                onClick={createuser}
              >
                Signup
              </button>
            </form>
            <div class="mt-3 text-center">
              <a href="#">Forgot Password?</a>
            </div>
            <div class="mt-3 text-center">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
