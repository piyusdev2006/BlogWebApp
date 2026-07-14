import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/Home.jsx";
import { Protected, Login } from "./components/index.js";

import AddPost from "./pages/AddPost.jsx";
import Signup from "./pages/Signup.jsx";
import EditPost from "./pages/EditPost";

import Post from "./pages/Post.jsx";

import AllPost from "./pages/AllPost.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: (
          <Protected authentication = {false} >
            <Login/>
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication = {false} >
            <Signup/>
          </Protected>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <Protected authentication >
            {" "}
            <AllPost/>
          </Protected>
        ),
      },
      {
        path: "/add-posts",
        element: (
          <Protected authentication >
            {" "}
            <AddPost/>
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication >
            {" "}
            <EditPost/>
          </Protected>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post/>
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
