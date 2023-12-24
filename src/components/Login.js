import React, { useState ,useContext} from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    try {
      const response = await axios.post('/api/login', formData);

      // Handle the response as needed
      console.log('Login Successful:', response.data);
      dispatch({ type: "LOGIN", payload: response.data });
      navigate("/");

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email"
            name="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            type="password"
            label="Password"
            name="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" color="textSecondary">
            Not Registered? <NavLink to="/register">Register Here</NavLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
