import React from "react";
import "../css/Featurespage.css";
import Navbar from "../Componets/Navbar.jsx";
import githubmark from "../assets/bookmark.webp";
import charts from "../assets/charts.jpg";
import explore from "../assets/explore.jpg";
import { useState, useEffect } from "react";

const Featurespage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

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
    <>
      <Navbar />
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="feature text-center">
              <img src={githubmark} alt="Bookmark Icon" />
              <h3>Bookmark Users</h3>
              <p>
                Save and organize your favorite GitHub users for quick access.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature text-center">
              <img src={charts} alt="Graph Icon" />
              <h3>Visualize Contributions</h3>
              <p>
                View the user's contributions in graphical format, including
                commits, pull requests, and issues.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature text-center">
              <img src={explore} alt="Repository Icon" />
              <h3>Explore Repositories</h3>
              <p>
                Discover the user's repositories and explore details such as
                stars, forks, and main programming language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Featurespage;
