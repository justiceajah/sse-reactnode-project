import React, { createContext, useReducer, useEffect, useContext } from "react";
import { GET_POSTS, GET_POST_STREAM, POST_REACTION } from "../actions";
import { ssEvents } from "../config";
import { getPosts } from "../lib";
import { appReducer } from "../reducer";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

const initialState = {
  userId: nanoid(),
  posts: [],
  isLoading: true,
  isError: false,
};

export const AppContext = createContext(initialState);

const AppProvider = (props) => {
  const [appState, appDispatch] = useReducer(appReducer, initialState);

  const { userId } = appState;

  useEffect(() => {
    // fetch initial posts
    const getFetchPosts = async () => {
      const res = await getPosts();
      appDispatch({ type: GET_POSTS, payload: res });
    };
    getFetchPosts();

    // listen to message event
    ssEvents.onopen = (e) => {
      console.log("CONNECTION ESTABLISHED");
    };

    ssEvents.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);
    };

    // listen to post event
    ssEvents.addEventListener("post", (e) => {
      const data = JSON.parse(e.data);
      console.log(userId !== data.userId);
      if (userId !== data.userId) {
        toast("New incoming post", {
          position: "bottom-right",
          autoClose: 1000,
          draggable: true,
          pauseOnHover: true,
          progress: undefined,
          hideProgressBar: false,
        });
      }
      setTimeout(() => {
        appDispatch({ type: GET_POST_STREAM, payload: data });
      }, 500);
    });

    // listen to post event
    ssEvents.addEventListener("post_reaction", (e) => {
      console.log(JSON.parse(e.data));
      const { likes, post } = JSON.parse(e.data);
      if (likes !== userId) {
        const message =
          post.userId === userId
            ? "Someone reacted to your post"
            : "New post reaction";
        toast(message, {
          position: "bottom-right",
          autoClose: 1000,
          draggable: true,
          pauseOnHover: true,
          progress: undefined,
          hideProgressBar: false,
        });
        appDispatch({
          type: POST_REACTION,
          payload: { id: post._id, likes: post.likes },
        });
      }
    });

    // listen to notification event
    ssEvents.addEventListener(`notification-${userId}`, (e) => {
      const data = JSON.parse(e.data);
      toast(data.title, {
        position: "top-right",
        autoClose: 1000,
        draggable: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
      });
    });

    // listen to open event
    ssEvents.onopen = (e) => {
      console.log(e);
    };
    // listen to error event
    ssEvents.onerror = (e) => {
      console.log(e);
    };

    /** Clean up the effect by closing the established connection if you wish to 
     * return () => {
    //   ssEvents.close();
    } */
  }, [userId]);

  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
