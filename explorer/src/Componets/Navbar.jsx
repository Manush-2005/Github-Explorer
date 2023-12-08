import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../Firebase.js";

import { set } from "firebase/database";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import backgroundimage from "../assets/rubaitul-azad-HLQDfaJUTVI-unsplash.jpg";
import { disablePersistentCacheIndexAutoCreation } from "firebase/firestore";

const Auth = getAuth(app);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const userid = useParams();

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  function logout() {
    signOut(Auth).then(() => {
      window.location.href = "/login";
    });
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a
            className="navbar-brand"
            href="/"
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              position: "absolute",
              left: "3%",
            }}
          >
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub Logo"
              style={{
                height: "41px",
                marginRight: "9px",
                marginBottom: "9px",
              }}
            />
            GitHub Explorer
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <div
                style={{ display: "flex", alignItems: "center", gap: "33px" }}
              >
                <li className="nav-item">
                  <Link to={`/Homepage/${userid.userid}`}>
                    <a
                      className="nav-link"
                      href="/Homepage"
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/Featurespage"
                    style={{
                      fontSize: "20px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/profile"
                    style={{ fontSize: "22px" }}
                  >
                    <Link
                      to={`/userprofile/${userid.userid}`}
                      style={{
                        textDecoration: "none",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "20px",
                      }}
                    >
                      UserProfile
                    </Link>
                  </a>
                </li>

                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-outline-dark mt-2"
                    style={{
                      borderRadius: "25px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                    }}
                  >
                    {user ? " Logout" : " Login"}
                  </button>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
