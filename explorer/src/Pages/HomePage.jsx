import React from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Card,
  InputGroup,
} from "react-bootstrap";
import "../css/HomePage.css";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../Firebase.js";
import AuthOptionsPage from "./Signinmethods.jsx";
import axios from "axios";
import { set } from "firebase/database";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import backgroundimage from "../assets/rubaitul-azad-HLQDfaJUTVI-unsplash.jpg";
import Navbar from "../Componets/Navbar.jsx";

const Auth = getAuth(app);

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [input, setinput] = useState(""); // state to check input form the serach bar
  const [searchusers, setsearchusers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userid = useParams();
  console.log(userid);

  // state to store the users searched

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);

    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // console.log(user);

  // main function to search for users
  const handlesearch = async (e) => {
    e.preventDefault();
    console.log(input);

    const config = {
      headers: {
        Authorization: ` Bearer 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`,
      },
    };

    const res = await axios.get(
      "https://api.github.com/search/users?q=" + input
    );

    if (res.data.items.length === 0) {
      alert("No user found with this name");
    }
    const users = res.data.items;

    const userwithdetails = await Promise.all(
      users.map(async (user) => {
        const useres = await axios.get(
          "http://api.github.com/users/" + user.login
        );
        return useres.data;
      })
    );
    console.log(userwithdetails);
    setsearchusers(userwithdetails);

    // console.log(searchusers);
  };

  // Function to logout and redirect to login page
  function logout() {
    signOut(Auth).then(() => {
      window.location.href = "/login";
    });
  }
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
    <div id="homepage">
      <Navbar />

      <div className="container">
        <div className="row" style={{ marginTop: "4%" }}>
          <div className="col-md-6 offset-md-3">
            <span style={{ fontSize: "80px", fontWeight: "700" }}>
              Welcome to{" "}
            </span>

            <span style={{ fontSize: "70px", fontWeight: "700" }}>
              Gitub Explorer
            </span>
            <p
              style={{
                fontSize: "20px",
                color: "#333",
                fontWeight: "500",
                lineHeight: "1.5",
              }}
            >
              Explore GitHub like never before! Discover user profiles,
              contributions, and repositories with our intuitive GitHub
              Explorer. Easily bookmark your favorite profiles for quick access.
            </p>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for GitHub users"
                value={input}
                onChange={(e) => setinput(e.target.value)}
                list="usernames"
              />

              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handlesearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {searchusers.slice(0, 3).map((user) => {
            return (
              <div key={user.id} className="col-md-4 mb-4">
                <div className="card">
                  <img
                    src={user.avatar_url}
                    className="card-img-top"
                    alt={user.login}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{user.login}</h5>
                    <p className="card-text">Followers: {user.followers}</p>
                    <Link
                      to={`/userdetail/${userid.userid}/${user.login}`}
                      className="btn btn-primary"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="text-center mt-10" style={{ marginTop: "20%" }}>
        <p>&copy; 2023 GitHub Explorer</p>
      </footer>
    </div>
  );
};

export default HomePage;
