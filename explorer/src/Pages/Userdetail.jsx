import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import loader from "../assets/Loading.gif";

Chart.register(CategoryScale, LinearScale, BarElement);

import axios from "axios";
import { app, db } from "../Firebase.js";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import Navbar from "../Componets/Navbar.jsx";
import { set } from "firebase/database";

const Userdetail = () => {
  const [user, setUser] = useState([]); // State for storing user data
  const [repos, setRepos] = useState([]); // State for storing user repos
  const [bookmark, setbookmark] = useState(false); // State for storing bookmarked users
  const [contributions, setcontributions] = useState({}); // State for storing contributions
  const [monthlyContributions1, setmonthlyContributions1] = useState({}); // State for storing monthly contributions
  const [organizations, setorganizations] = useState([]); // State for storing organizations
  const [loading, setLoading] = useState(true);

  // const chartRef = useRef(null);
  const { username } = useParams(); // Getting username from url
  const userid = useParams(); // Getting userid from url

  // Fetching user data from github api
  useEffect(() => {
    async function getuser() {
      const res = await axios.get(`https://api.github.com/users/${username}`);
      setUser(res.data);
    }

    getuser();

    async function getrepos() {
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      setRepos(res.data);
    }
    getrepos();

    async function getcontributions() {
      let contributions = {
        commits: 0,
        issues: 0,
        pullRequests: 0,
      };

      let monthlyContributions = {};

      const res = await axios.get(
        `https://api.github.com/users/${username}/events`
      );

      let dataforuser = res.data;
      console.log(dataforuser);
      dataforuser.map((info) => {
        let month = new Date(info.created_at).getMonth();
        if (!monthlyContributions[month]) {
          monthlyContributions[month] = {
            commits: 0,
            pullRequests: 0,
          };
        }

        if (info.type === "PushEvent") {
          contributions.commits += info.payload.size;
          monthlyContributions[month].commits += info.payload.size;
        } else if (
          info.type === "PullRequestEvent" &&
          info.payload.action === "opened"
        ) {
          contributions.pullRequests++;
        } else if (
          info.type === "IssuesEvent" &&
          info.payload.action === "opened"
        ) {
          contributions.issues++;
          monthlyContributions[month].pullRequests++;
        }
      });

      setmonthlyContributions1(monthlyContributions);

      return contributions;
    }

    getcontributions().then((usercontribution) => {
      setcontributions(usercontribution);
    });

    async function getorganizations() {
      const res = await axios.get(
        "https://api.github.com/users/" + username + "/orgs"
      );
      const orgdata = res.data;
      setorganizations(orgdata);
    }
    getorganizations();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  function findmainlanguage() {
    const languages = {};

    repos.map((repo) => {
      let language = repo.language;
      if (language) {
        if (languages[language]) {
          languages[language] += 1;
        } else {
          languages[language] = 1;
        }
      }
    });

    if (Object.keys(languages).length > 0) {
      const mainLanguage = Object.keys(languages).reduce((a, b) =>
        languages[a] > languages[b] ? a : b
      );

      return mainLanguage;
    } else {
      return "No language detected";
    }
  }

  let mainlanguage = findmainlanguage();

  function handlebookmark() {
    if (!bookmark) {
      const refdoc = doc(
        db,
        "bookmarks",
        userid.userid,
        "bookmark users",
        user.login
      );
      setDoc(refdoc, {
        user: user.login,
      });
    }

    setbookmark(!bookmark);
  }

  const data = {
    labels: Object.keys(monthlyContributions1).map((month) =>
      new Date(2022, month).toLocaleString("default", { month: "long" })
    ),
    datasets: [
      {
        label: "Commits",
        data: Object.values(monthlyContributions1).map(
          (contribution) => contribution.commits
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Pull Requests",
        data: Object.values(monthlyContributions1).map(
          (contribution) => contribution.pullRequests
        ),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "left",
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
  console.log(user);

  return (
    <>
      {/* <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <img
                src={user.avatar_url}
                className="card-img-top"
                alt={user.name}
              />
              <button onClick={handlebookmark}>
                {bookmark ? " Remove Bookmark" : " Bookmark"}
              </button>
              <div className="card-body text-center">
                <h2 className="card-title">{user.login}</h2>
                <p className="card-text">Location: {user.location}</p>
                <p className="card-text">Followers: {user.followers}</p>
                <p className="card-text">Repositories: {user.public_repos}</p>
                <p className="card-text">{user.bio}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-3">Repositories</h3>
              <div className="list-group">
                {repos.map((repo) => (
                  <div key={repo.id} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{repo.name}</h5>
                      <p className="card-text">{repo.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="badge bg-info">
                            {repo.private ? "Private" : "Public"}
                          </span>
                          <span className="badge bg-secondary">
                            <i class="fas fa-code"></i> {repo.language}
                          </span>
                        </div>
                        <div>
                          <i class="fas fa-star"></i> {repo.stargazers_count}{" "}
                          <i class="fas fa-code-branch"></i> {repo.forks_count}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <Navbar />
      <div className="container mt-5">
        <header class="bg-dark text-white py-5">
          <div class="container text-center">
            <img
              src={user.avatar_url}
              alt="User Image"
              class="rounded-circle"
              // style="width: 150px; height: 150px; object-fit: cover;"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <h1>{user.login}</h1>
            <p>Followers: {user.followers}</p>
            <p>Public Repositories: {user.public_repos}</p>
            {organizations.length > 0 && (
              <div className="mt-4">
                <h2>Organizations</h2>
                <div className="d-flex flex-wrap">
                  {organizations.map((org) => (
                    <div key={org.id} className="m-2">
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={org.avatar_url}
                          alt={org.login}
                          className="rounded-circle"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlebookmark}
              className="btn btn-outline-primary mt-2"
              style={{ borderRadius: "25px", fontWeight: "bold" }}
            >
              {bookmark ? " Remove Bookmark" : " Bookmark"}
            </button>
          </div>
        </header>

        <main class="py-5">
          <div class="container">
            <section>
              <h2>Bio</h2>
              <p>{user.bio}</p>
            </section>
            <section>
              <h2>Location</h2>
              <p>{user.location}</p>
            </section>
            <div className="mt-4">
              <h3 className="mb-3">Repositories</h3>
              <div className="list-group">
                {repos.map((repo) => (
                  <div key={repo.id} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{repo.name}</h5>
                      <p className="card-text">{repo.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="badge bg-info">
                            {repo.private ? "Private" : "Public"}
                          </span>
                          <span className="badge bg-secondary">
                            <i class="fas fa-code"></i> {repo.language}
                          </span>
                        </div>
                        <div>
                          <i class="fas fa-star"></i> {repo.stargazers_count}{" "}
                          <i class="fas fa-code-branch"></i> {repo.forks_count}
                          <br></br>
                          <button
                            className="btn btn-outline-primary mt-2"
                            onClick={() => {
                              window.location.href = repo.svn_url;
                            }}
                          >
                            {" "}
                            View repo on GITHUB{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-header bg-primary text-white">
                <h2>User Specific Info</h2>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Main Language:</strong> {mainlanguage || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Total Contributions:</strong>{" "}
                  {contributions.total || 0}
                </li>
                <li className="list-group-item">
                  <strong>Issues:</strong> {contributions.issues || 0}
                </li>
                <li className="list-group-item">
                  <strong>Commits:</strong> {contributions.commits || 0}
                </li>
                <li className="list-group-item">
                  <strong>Pull Requests:</strong>{" "}
                  {contributions.pullRequests || 0}
                </li>
              </ul>
            </div>

            <div className="card mt-4">
              <div className="card-header bg-dark text-white">
                <h2>Monthly Contributions</h2>
              </div>
              <div className="card-body">
                <Bar data={data} options={options} />
              </div>
              <div className="card-footer">
                <button className="btn btn-primary">
                  PRs && issues && commits
                </button>
              </div>
            </div>
          </div>
        </main>
        <footer class="bg-light text-center py-3">
          <div class="container">
            <p>&copy; 2023 User Profile</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Userdetail;
