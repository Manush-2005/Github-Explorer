import React from "react";
import { Container, Button } from "react-bootstrap";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
const provider = new GoogleAuthProvider();
const provider2 = new GithubAuthProvider();
import { app, db } from "../Firebase.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const Auth = getAuth(app);
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

const AuthOptionsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);
  const googleSignIn = () => {
    signInWithPopup(Auth, provider).then((result) => {
      const credientail = GoogleAuthProvider.credentialFromResult(result);
      const token = GoogleAuthProvider.accessToken;

      const email = result.user.email;

      const userid = result.user.uid;

      const refdoc = doc(db, "users", userid);
      console.log(refdoc);

      getDoc(refdoc).then((doc) => {
        if (doc.exists()) {
          const userdata = doc.data();
          console.log(userdata);
        } else {
          console.log("no document");
          setDoc(refdoc, {
            email: email,
            userid: userid,
          });
        }
      });

      alert("Signed In Successfully");
      console.log(result);
      window.location = `/HomePage/${userid}`;
    });
  };

  const githubSignIn = () => {
    signInWithPopup(Auth, provider2).then((result) => {
      const credientail = GithubAuthProvider.credentialFromResult(result);
      const token = GithubAuthProvider.accessToken;
      const email = result.user.email;

      const userid = result.user.uid;

      const refdoc = doc(db, "users", userid);
      console.log(refdoc);

      getDoc(refdoc).then((doc) => {
        if (doc.exists()) {
          const userdata = doc.data();
          console.log(userdata);
        } else {
          console.log("no document");
          setDoc(refdoc, {
            email: email,
            userid: userid,
          });
        }
      });

      alert("Signed In Successfully");
      console.log(result);
      window.location = `/HomePage/${userid}`;
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
    <>
      {/* <div
        style={{
          // backgroundImage: `url(${Backgroundimage})`,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          style={{
            maxWidth: "500px",
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Choose an Authentication Method
          </h2>
          <Button
            variant="primary"
            style={{ margin: "10px", width: "100%" }}
            onClick={googleSignIn}
          >
            Sign Up with Google
          </Button>
          <Button
            variant="primary"
            style={{ margin: "10px", width: "100%" }}
            onClick={githubSignIn}
          >
            Sign Up with GitHub
          </Button>
          <Button variant="primary" style={{ margin: "10px", width: "100%" }}>
            <Link to="/signup" style={{ color: "#fff" }}>
              Continue with Email
            </Link>
          </Button>
        </Container>
      </div>

      <div className="container">
        <div className="card">
          <h2>Choose an Authentication Method</h2>
          <Button variant="primary" className="button" onClick={googleSignIn}>
            Sign Up with Google
          </Button>
          <Button variant="primary" className="button" onClick={githubSignIn}>
            Sign Up with GitHub
          </Button>
          <Button variant="primary" className="button">
            <Link to="/signup">Continue with Email</Link>
          </Button>
        </div>
      </div> */}

      <div class="container text-center mt-5">
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Cat Logo"
          class="mb-4"
          style={{ width: "72px", height: "72px" }}
        />
        <h1 class="mb-4">GitHub Explorer</h1>
        <p class="lead mb-4">Choose how you want to continue</p>
        <div class="row justify-content-center">
          <div class="col-md-4">
            <button
              class="btn btn-primary btn-lg btn-block mb-3"
              onClick={googleSignIn}
            >
              Continue with Google
            </button>
            <button
              class="btn btn-dark btn-lg btn-block mb-3"
              onClick={githubSignIn}
            >
              Continue with GitHub
            </button>
            <button
              class="btn btn-secondary btn-lg btn-block mb-3"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Continue with Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthOptionsPage;
