import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const FIND_USER = gql`
  query GetUser($id:ID!){
    getUser(id:$id){
      id
      email
      password
    }
  }
`;

const CHECK_HASH = gql`
  mutation CheckHashPassword($password:String!, $hash:String!){
    checkHashPassword(password:$password, hash:$hash)
  }
`;

const RESET_PASSWORD = gql`
  mutation UpdatePassword($email:String!, $password:String!){
    updatePassword(email:$email, password:$password)
  }
`;

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conpass, setConpass] = useState("");

    const params = useParams();
    const id = JSON.stringify(params.id).replace(/"/g, '');

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    const { data, loading, error } = useQuery(FIND_USER, {
      variables: {
        id: id,
      },
    });

    const [updatePassword] = useMutation(RESET_PASSWORD);
    const [checkHashPassword, {data: resultData, loading: resultLoading, error: resultError}] = useMutation(CHECK_HASH);
    
    const navigate = useNavigate();

    useEffect(() => {
      if(data != null) {
        setEmail(data?.getUser?.email);
      }
    }, [data]);
    
    const handleReset = async () => {
      if(password == conpass){
        await checkHashPassword({
          variables: {
            password: password,
            hash: data?.getUser?.password,
          },
        }).then((result) => {
          console.log(result.data.checkHashPassword);
          if(result.data.checkHashPassword){
            setShowErrorPopup(true);
            setTimeout(() => {
              setShowErrorPopup(false);
            }, 3000);
            return
          }else{
            updatePassword({
              variables: {
                email: email,
                password: password,
              },
            }).then((result) => {
              console.log(result.data.updatePassword);
              setShowSuccessPopup(true);
              setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/login');
              }, 3000);
            });
          }
        })
      }else{
        console.log("TIDAK SAMA")
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
      }

      setPassword("");
      setConpass("");
    }

    // useEffect(() => {
    //   if (error) {
    //     console.log(error);
    //     setShowErrorPopup(true);
    //     setTimeout(() => {
    //       setShowErrorPopup(false);
    //     }, 3000);
    //   } else if (data) {
    //     emailjs.init('dXcL3m--QDPAzlBek');
    //     var params = {
    //       from_name : "Facebook",
    //       email_id : email,
    //       message : "http://localhost:5173/resetPassword/" + data.getUserByEmail.id
    //     }
    //     emailjs.send('service_0rx8u1z', 'template_oo4id0b', params)
    //     .then((result) => {
    //         console.log(result.text);
    //         console.log(data.getUserByEmail)
    //     }, (error) => {
    //         console.log(error.text);
    //     });
  
    //     setShowSuccessPopup(true);
    //     setTimeout(() => {
    //       setShowSuccessPopup(false);
    //     }, 3000);
    //   } else {
    //     setShowErrorPopup(true);
    //     setTimeout(() => {
    //       setShowErrorPopup(false);
    //     }, 3000);
    //     console.log("User not found");
    //   }
    // }, []);

    if(data){
      return (
        <div>      
          <div className="container">
            <div className="form">
              <h2>Reset Password</h2>
              <h6 >Please enter your new password to update your account <br/>password</h6>
              <div className="inputBox">
                <input
                  type="text"
                  name="email"
                  value={email}
                  disabled
                />
                <i className="fa-regular fa-envelope"></i>
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
                <input
                  type="password"
                  name="conpass"
                  value={conpass}
                  required
                  onChange={(e) => setConpass(e.target.value)}
                />
                <i className="fa-solid fa-lock"></i>
                <span>Confirm Password</span>
              </div>
              <div className="inputBox">
                <input type="submit" onClick={handleReset} value="Reset Password"/>
              </div>
            </div>

            {showSuccessPopup && (
              <div className="successPopup">
                <span>Reset Password Success!</span>
              </div>
            )}
    
            {showErrorPopup && (
              <div className="errorPopup">
                <span>Reset Password Failed!</span>
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
    }

    return (
      <div>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    );
        
};

export default ResetPassword;
  