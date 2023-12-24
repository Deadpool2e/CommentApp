import React,{useContext} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

const NavBar = () => {
  const { state, dispatch } = React.useContext(UserContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to="/" style={{ textDecoration: "none", color: "white" }}>
              Comment App
            </NavLink>
          </Typography>
          {state.isLoggedIn ? (
            // Display user name and icon when logged in
            <>
              <Typography variant="h6" sx={{ marginRight: 1, color: 'white' }}>
                {state.userData.name}
              </Typography>
              <AccountCircleIcon sx={{ color: 'white' }} />
              <Button component={NavLink} to="/logout" color="inherit" style={{ marginLeft: 3 }}>
                Logout
              </Button>
            </>
          ) : (
            // Display login button when not logged in
            <Button component={NavLink} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
