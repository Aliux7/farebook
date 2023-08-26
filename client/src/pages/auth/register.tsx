import React, { useState } from "react";
import "../../styles/index.css"
import { gql, useMutation } from "@apollo/client";
import { NavLink, useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

const CREATE_USER_MUTATION = gql`
  mutation Create($inputUser:NewUser!){
    createUser(inputUser:$inputUser){
      id
      email
      password
    }
  }
`;

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const navigate = useNavigate();
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER_MUTATION);

  const handleRegister = async () => {

    if(firstName == "" || surName == "" || email == "" || password == "" || dob == "" || gender == ""){
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); 
      return
    }

    if(firstName.length < 5){
      console.log("5")
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); 
      return
    }

    if(!email.endsWith(".com") ){
      console.log("5.com")
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); 
      return
    }
    
    const inputDate = new Date(dob);
    const todayDate = new Date();
    if(inputDate < todayDate == false){
      console.log(inputDate )
      console.log(todayDate )
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); 
      return
    }

    try {
      const inputUser = {
        profilePicture: "https://res.cloudinary.com/dz7mnls0q/image/upload/v1691980838/defaultProfile_xtheqc.jpg",
        firstName: firstName,
        surName: surName,
        email: email,
        password: password,
        dob: dob,
        gender: gender
      };

      createUser({
        variables: {
          inputUser: inputUser,
        },
      }).then((result) => {
        emailjs.init('dXcL3m--QDPAzlBek');
        var params = {
          from_name : "Facebook",
          email_id : email,
          to_email: email,
          message : "http://localhost:5173/verifyEmail/" + result.data.createUser.id
        }
        emailjs.send('service_0rx8u1z', 'template_t0lyfw9', params)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
      })

      setFirstName("");
      setSurName("");
      setEmail("");
      setPassword("");
      setDob("");
      setGender("");

      navigate('/');

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000); // Show success popup for 3 seconds
    } catch (error) {
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000); // Show error popup for 3 seconds
    }

  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>      
      <NavLink to='/'><img src="/asset/facebookIcon.png" alt="Facebook Icon" style={{ maxWidth:"208px", width:'40vw', marginBottom: "10px"}}/></NavLink>
      <div className="container">
        <div className="form">
          <h2>Sign Up</h2>
          <div className="inputBox">
            <input
              type="text"
              name="firstName"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <i className="fa-regular fa-address-card"></i>
            <span>First Name</span>
          </div>
          <div className="inputBox">
            <input
              type="text"
              name="surName"
              value={surName}
              required
              onChange={(e) => setSurName(e.target.value)}
            />
            <i className="fa-regular fa-address-card"></i>
            <span>Surname</span>
          </div>
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
            <input
              type="date"
              name="date"
              value={dob}
              required
              onChange={(e) => setDob(e.target.value)}
            />
            <i className="fa-regular fa-envelope"></i>
          </div>
          <div className="inputBox">
            <select
              name="gender"
              value={gender}
              required
              onChange={(e) => setGender(e.target.value)}
              style={{margin:'0px'}}
            >
              <option disabled value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
            <i className="fa-solid fa-venus-mars"></i>
          </div>

          <div className="inputBox">
            <input type="submit" onClick={handleRegister} value="Create Account"/>
          </div>
          <p>Already a member ? <NavLink to='/login' style={{color: "#3b5998"}}>Log In</NavLink> </p>
        </div>
        
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="successPopup">
            <span>Registration successful!</span>
          </div>
        )}

        {/* Success Popup */}
        {showErrorPopup && (
          <div className="errorPopup">
            <span>Registration failed!</span>
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

export default Register; 
