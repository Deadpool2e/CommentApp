import React,{useContext, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import axios from 'axios';

const Logout = () => {
    const {state,dispatch} = useContext(UserContext);
    const navigate = useNavigate();
    const callHome = async () => {
        try {
          const response = await axios.get('/api/logout', {
            withCredentials: true, 
          });
      
          const data = response.data;
      
          if (data) {
            dispatch({ type: "LOGOUT" });
            navigate('/login');
          }
      
          if (response.status !== 200) {
            const error = new Error(response.statusText);
            throw error;
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        callHome();
      }, []);

  return (
    <>
    </>
  )
}

export default Logout