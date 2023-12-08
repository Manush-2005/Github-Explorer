import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useState,useEffect} from "react";
// import app from "../Firebase";
import { app, db } from "../Firebase";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Navbar from "../Componets/Navbar";
const Auth = getAuth(app);


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const loginuser = () => {
    signInWithEmailAndPassword(Auth, email, password).then((result) => {
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

      // await getDoc(refdoc).then((doc) => {
      //   console.log(doc);
      // });
      // alert("Logged In Successfully");
      // console.log(result);

      alert("Logged In Successfully");
      console.log(result);
      window.location = `/HomePage/${userid}`;
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
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
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Log In</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Form.Text className="text-muted">
              <a href="/forgot-password">Forgot Password?</a>
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            style={{ width: "100%", marginTop: "20px" }}
            onClick={loginuser}
          >
            Log In
          </Button>
        </Form>
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don't have an account? <a href="/">Create one</a>
        </p>
      </Container>
    </div>
  );
};

export default LoginPage;
