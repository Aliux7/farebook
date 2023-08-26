import React, { useEffect, useState } from "react";
import "../../styles/index.css"
import { NavLink } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import Cookies from 'cookies-next';
import { setCookie } from 'cookies-next'; 
import { encryptStorage } from "../../App";

const AUTH_USER_MUTATION = gql`
  mutation Login($credentials: LoginCredentials!){
    login(credentials:$credentials)
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  
  const [login, { data, loading, error }] = useMutation(AUTH_USER_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if(email == "" || password == ""){
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); // Show error popup for 3 seconds
      return
    }

    try {
      const credentials = {
        email: email,
        password: password
      };

      await login({
        variables: {
          credentials: credentials,
        },
      }).then((response) => {
        console.log (response);
        if(response.data.login == ""){
          setShowErrorPopup(true);
          setTimeout(() => {
            setShowErrorPopup(false);
          }, 3000); // Show error popup for 3 seconds
        }else{
          encryptStorage.setItem("jwtToken", response.data.login)
          window.location.reload();
          navigate('/');
        }
      });
    } catch (error) {
      console.log(error)
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); // Show error popup for 3 seconds
    }
    
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>      
      <NavLink to='/'><img src="/asset/facebookIcon.png" alt="Facebook Icon" style={{ maxWidth:"208px", width:'40vw', marginBottom: "10px"}} className="logo-facebook-login"/></NavLink>
      <div className="container">
        <div className="form">
          <h2>Sign In</h2>
          <div className="inputBox">
            <input
              type="text"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fa-regular fa-envelope"></i>
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fa-solid fa-lock"></i>
            <span>Password</span>
          </div>
          <div className="inputBox">
            <input type="submit" onClick={handleLogin} value="Login"/>
          </div>
          <p><NavLink to='/forgottenAccount' style={{color: "#3b5998"}}>Forgotten account?</NavLink></p>
          
          <p>Not Registered ? <NavLink to='/register' style={{color: "#3b5998"}}>Create an account</NavLink> </p>
        </div>

        {/* Success Popup */}
        {showErrorPopup && (
          <div className="errorPopup">
            <span>Login failed!</span>
          </div>
        )}
      </div>
      <style>
        {`
          body ,
          .container .form .inputBox input,
          .container .form .inputBox input:valid ~ span,
          .container .form .inputBox input:focus ~ span{
            background-color: white;
          }

          .container {
            border: 8px solid #ffffff;
          }

          .container .form h2,
          .container .form .inputBox input,
          .container .form .inputBox span{
            color: #000000
          }

          .container .form p {
            color: #000000
          }

        `}
      </style>
    </div>
  );
};

export default Login; 