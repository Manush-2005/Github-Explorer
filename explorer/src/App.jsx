import { getDatabase } from "firebase/database";
import { app } from "./Firebase.js";
import SignupPage from "./Pages/SignupPage.jsx";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import LoginPage from "./Pages/LoginPage.jsx";
import AuthOptionsPage from "./Pages/Signinmethods.jsx";
import { useState } from "react";
import { useEffect } from "react";
import Userdetail from "./Pages/Userdetail.jsx";

import HomePage from "./Pages/HomePage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Userprofilepage from "./Pages/Userprofilepage.jsx";
import Featurespage from "./Pages/Featurespage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthOptionsPage />} />
          <Route path="/HomePage/:userid" element={<HomePage />} />
          <Route path="/userprofile/:userid" element={<Userprofilepage />} />
          <Route
            path="/userdetail/:userid/:username"
            element={<Userdetail />}
          />
           <Route
            path="/Featurespage"
            element={<Featurespage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
