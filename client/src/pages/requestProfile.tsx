import React, { useState } from "react";
import { getUser } from "../components/GetUser";
import "../styles/Profile.css"
import { gql, useMutation, useQuery } from "@apollo/client";
import Axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loadingIndicator";
import GetUserPosts from "../components/GetUserPosts";

const GET_USER_PROFILE = gql`
  query GetUser($id:ID!){
    getUser(id:$id){
      id
      profilePicture
      firstName
      surName
      email
      dob
      gender
    }
  }
`;

const RequestProfile = () => {
  const location = useLocation();
  const passedValue = location.state?.value.friendID;
  const formData = new FormData();
  const navigate = useNavigate();
  const {data, loading, error} = useQuery(GET_USER_PROFILE, {
    variables: {
      id: passedValue
    }
  })
  
  console.log(passedValue);

  if (!data) return null;

  console.log(data.getUser);

  return (
    <div style={{ position: "absolute", top: "0px", left: "15vw", right: "15vw" }}>
      <div>
        <img
          src="https://res.cloudinary.com/dz7mnls0q/image/upload/v1691982045/Wallpaper_czhfqk.jpg"
          style={{ width: "70vw", height: "70vh", borderRadius: "20px" }}
        ></img>
        <div style={{ display: "flex" }}>
          <img
            src={data.getUser.profilePicture}
            style={{ borderRadius: "50%", width: "200px", marginTop: "-50px", marginLeft: "50px", border:'5px solid var(--body_background)' }}
          ></img>
          <div style={{ marginLeft: "30px", marginTop: "10px" }}>
            <h1 style={{ marginLeft: "10px" }}>{data.getUser.firstName + " " + data.getUser.surName}</h1>
            <p className="timeAgo" style={{ marginTop: "10px" }}>
              {data.getUser.gender}
            </p>
            <p className="timeAgo" style={{ marginTop: "10px" }}>
              {data.getUser.dob}
            </p>
          </div>
        </div>
      </div>
      <div className="PeopleYouMayKnow">

      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <div className="SideLeft" style={{ flex: 1 }}>
          asd
        </div>
        <div className="SideRight" style={{ flex: 1 }}>
          {/* <GetUserPosts /> */}
        </div>
      </div>
      {loading && (
        <div className="overlay">
          <LoadingIndicator loading={loading} />
        </div>
      )}
    </div>
  );
};

export default RequestProfile;
