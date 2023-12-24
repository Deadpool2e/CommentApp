import React, { createContext, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import PostPage from "./components/PostPage";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import AddPost from "./components/AddPost";
import reducer, { initialState } from "./reducer/UseReducer";
import Logout from "./components/Logout";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <NavBar />
          <Container>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/posts/:postId" element={<PostPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout/>} />
              <Route path="/addpost" element={<AddPost />} />
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
