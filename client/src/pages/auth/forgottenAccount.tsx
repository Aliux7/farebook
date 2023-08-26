import React, { useEffect, useState } from "react";
import "../../styles/index.css"
import { gql, useMutation, useQuery } from "@apollo/client";
import { NavLink, useNavigate } from 'react-router-dom';
import { setCookie } from 'cookies-next'; 
import emailjs from '@emailjs/browser';

const FIND_USER = gql`
  query GetUserByEmail($email:String!){
    getUserByEmail(email:$email){
      id
      email
      password
    }
  }
`;

const ForgottenAccount = () => {
  const [email, setEmail] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const { data, loading, error } = useQuery(FIND_USER, {
    variables: {
      email: email,
    },
  });
  const handleReset = () => {
    if (error) {
      console.log(error);
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    } else if (data) {
      emailjs.init('dXcL3m--QDPAzlBek');
      var params = {
        from_name : "Facebook",
        email_id : email,
        message : "http://localhost:5173/resetPassword/" + data.getUserByEmail.id
      }
      emailjs.send('service_0rx8u1z', 'template_oo4id0b', params)
      .then((result) => {
          console.log(result.text);
          console.log(data.getUserByEmail)
      }, (error) => {
          console.log(error.text);
      });

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } else {
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      console.log("User not found");
    }
    setEmail("");
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>      
      <NavLink to='/'><img src="/asset/facebookIcon.png" alt="Facebook Icon" style={{ maxWidth:"208px", width:'40vw', marginBottom: "10px"}}/></NavLink>
      <div className="container">
        <div className="form">
          <h2>Find Your Account</h2>
          <h6 >Please enter your email address or mobile number to search<br/>for your account</h6>
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
            <input type="submit" onClick={handleReset} value="Search"/>
          </div>
          
        </div>

        {showSuccessPopup && (
          <div className="successPopup">
            <span>Reset Password Link Send Successfully!</span>
          </div>
        )}

        {showErrorPopup && (
          <div className="errorPopup">
            <span>Email Not Found!</span>
          </div>
        )}
      </div>
      <style>
        {`
          body ,
          .container .form .inputBox input,
          .container .form .inputBox select,
          .container .form .inputBox input:valid ~ span,
          .container .form .inputBox input:focus ~ span{
            background-color: white;
          }

          .container {
            border: 8px solid #ffffff;
          }

          .container .form h2,
          .container .form h6,
          .container .form .inputBox span,
          .container .form .inputBox select,
          .container .form .inputBox option,
          .container .form .inputBox input{
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

export default ForgottenAccount; 