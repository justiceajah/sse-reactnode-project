import React, { useEffect, useState } from "react";
import Posts from "./components/Posts";
import AddPostModal from "./components/AddPostModal";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { ToastContainer } from "react-toastify";
import { useAppContext } from "./context";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.css";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const {
    appState: { isError },
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleShow = () => setIsOpen(!isOpen);

  // OAUTH starts here.
  const [profile, setProfile] = useState([]);
  const [user, setUser] = useState([]);
 
  useEffect(() => {
    console.log(user);
    if (user && Object.keys(user)?.length > 0) {
      console.log("User is: ====>", user);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  const handleLoginButtonClick = useGoogleLogin({
    onSuccess: handleResponseMessage,
    onError: handleErrorMessage,
  });

  function handleResponseMessage(response) {
    console.log(response);
    setUser(response);
  }

  function handleErrorMessage(error) {
    console.log("Login Failed with the following error: ", error);
  }

  const logOut = () => {
    googleLogout();
    setProfile([]);
  };

  // OAUTH Ends here.
  return (
    <div className="App">
      <header className="App-header">
        <div className="d-flex justify-content-between">
          <h2 className="mr-2">SSE Realtime Newsfeed</h2>
          <MDBBtn onClick={() => toggleShow()}>Add Post</MDBBtn>
        </div>
      </header>
      {!isError && (
        <h2 className="mt-3 mb-3">
          Open this app in a new tab or windows and try to add new post or like
          a post and see the real-time functionality in action.
        </h2>
      )}
      <MDBContainer fluid className="mt-3 mb-3">
        <Posts />
      </MDBContainer>
      <ToastContainer />
      <AddPostModal isOpen={isOpen} toggleShow={toggleShow} />

      <div>
        <h2>React Google Login</h2>
        <br />
        <br />

        {profile?.length === 0 && (
          <div
            style={{
              width: "200px",
              margin: "0 auto",
            }}
          >
            {/* <GoogleLogin
              onSuccess={handleResponseMessage}
              onError={handleErrorMessage}
            /> */}
            <button onClick={() => handleLoginButtonClick()}>
              Sign in with Google 🚀{" "}
            </button>
          </div>
        )}

        <div>
          {profile && Object.keys(profile)?.length > 0 && (
            <div>
              <img src={profile?.picture} alt="user image" />
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <br />
              <br />
              <button onClick={logOut}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
