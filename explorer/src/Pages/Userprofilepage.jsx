import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { app, db } from "../Firebase";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import Navbar from "../Componets/Navbar";

const Userprofilepage = () => {
  const [user, setuser] = useState({});
  const [userbookmarks, setuserbookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const Auth = getAuth(app);

  const userid = useParams();
  console.log(userid.userid);

  const userloggedin = Auth.currentUser;

  useEffect(() => {
    function getuser() {
      const refodc = doc(db, "users", userid.userid);
      getDoc(refodc).then(async (doc) => {
        if (doc.exists()) {
          const userdata = doc.data();
          // console.log(userdata);
          setuser(userdata);
          console.log(user);
        } else {
          console.log("no document");
        }
      });
    }
    getuser();

    async function getuserbookmarks() {
      const refcollection = collection(
        db,
        "bookmarks",
        userid.userid,
        "bookmark users"
      );
      const snapshot = await getDocs(refcollection);
      const bookmarkdata = snapshot.docs.map((doc) => doc.data());
      setuserbookmarks(bookmarkdata);
    }
    // console.log(user);
    getuserbookmarks();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  console.log(userbookmarks);

  function sendEmailVerification() {}

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

      <header class="bg-dark text-white py-5">
        <div class="container text-center">
          <h1>User Name</h1>
          <p>User Email: {user.email}</p>
        </div>
      </header>
      <main class="py-5">
        <div class="container">
          <section>
            <h2>Bookmarks</h2>
            {userbookmarks.map((bookmarked) => {
              return (
                <div class="row">
                  <div class="col-md-4">
                    <div class="card mb-4">
                      <div class="card-body">
                        <h3 class="card-title">{bookmarked.user}</h3>
                        <p class="card-text">
                          Description of the bookmarked item goes here...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
          <section>
            <h2>Followed Users</h2>
            <div class="row">
              <div class="col-md-4">
                <div class="card mb-4">
                  <div class="card-body">
                    <h3 class="card-title">Followed User 1</h3>
                    <p class="card-text">
                      Description of the followed user goes here...
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card mb-4">
                  <div class="card-body">
                    <h3 class="card-title">Followed User 2</h3>
                    <p class="card-text">
                      Description of the followed user goes here...
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card mb-4">
                  <div class="card-body">
                    <h3 class="card-title">Followed User 3</h3>
                    <p class="card-text">
                      Description of the followed user goes here...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer class="bg-light text-center py-3">
        <div class="container">
          <p>&copy; 2023 User Profile</p>
        </div>
      </footer>
    </>
  );
};

export default Userprofilepage;
