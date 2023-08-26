import React, { useState } from "react";
import { getUser } from "../../src/components/GetUser";
import "../styles/Profile.css"
import { gql, useMutation, useQuery } from "@apollo/client";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loadingIndicator";
import GetUserPosts from "../components/GetUserPosts";

const UPDATE_USER = gql`
  mutation UpdateProfilePicture($id:ID!, $profilePicture:String!){
    updateProfilePicture(id:$id,profilePicture:$profilePicture){
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

const GET_USER_POST = gql`
  query GetAllPost($id:ID!, $offset:Int, $limit:Int){
    getAllPost(id:$id, offset:$offset, limit:$limit){
      id
      userID
      userName
      datePost
      textPost
      privacy
    }
  }
`;


const Profile = () => {
  const user = getUser();
  const formData = new FormData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [updateProfilePicture] = useMutation(UPDATE_USER);
  const {data: postData, loading: postLoading, error: errorData} = useQuery(GET_USER_POST);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const closeEditProfilePopup = () => {
    setIsEditProfileOpen(false);
    setIsInputFilled(false);
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    setIsInputFilled(file && file.type.includes("image")); 
    setSelectedImage(file);
  };

  const handleSave = async () => {
    try {
      if (selectedImage) {
        setLoading(true);
        formData.append("file", selectedImage);
        formData.append("upload_preset", "pav17yz2");
    
        let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/';
        if (selectedImage.type.includes('image')) {
          apiUrl += 'image/upload';
        } else {
          console.log(`Unsupported file type: ${selectedImage.type}`);
        }

        Axios.post(
          apiUrl,
          formData
        ).then((response) => {
          updateProfilePicture({
            variables: {
              id: user.getUserByToken.id,
              profilePicture: response.data.secure_url,
            },
          }).then(() => {
            setLoading(false);
            setIsEditProfileOpen(false);
            window.location.reload();
          })
        });
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleMessage = () => {
    
  }

  if (!user) return null;

  console.log(user.getUserByToken);

  return (
    <div style={{ position: "absolute", top: "0px", width:'100vw', display:'flex', justifyContent:'center', alignItems:'baseline' }}>
      <div>
        <img
          src="https://res.cloudinary.com/dz7mnls0q/image/upload/v1691982045/Wallpaper_czhfqk.jpg"
          style={{ width: "70vw", height: "70vh", borderRadius: "20px" }}
        ></img>
        <div style={{ display: "flex" }}>
          <img
            src={user.getUserByToken.profilePicture}
            style={{ borderRadius: "50%", width: "200px", marginTop: "-50px", marginLeft: "50px", border:'5px solid var(--body_background)' }}
          ></img>
          <div style={{ marginLeft: "30px", marginTop: "10px" }}>
            <h1 style={{ marginLeft: "10px" }}>{user.getUserByToken.firstName + " " + user.getUserByToken.surName}</h1>
            <p className="timeAgo" style={{ marginTop: "10px" }}>
              {user.getUserByToken.gender}
            </p>
            <p className="timeAgo" style={{ marginTop: "10px" }}>
              {user.getUserByToken.dob}
            </p>
            <div onClick={handleEditProfileClick} style={{marginLeft:'42vw', backgroundColor:'var(--hover_background)', padding:'10px', borderRadius:'10px', cursor:'pointer'}}>Edit Profile</div>
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
          <GetUserPosts />
        </div>
      </div>

      {isEditProfileOpen && (
        <div className="overlay" onClick={closeEditProfilePopup}>
          <div className="createPostContainer" onClick={(e) => e.stopPropagation()} style={{display:'flex', alignItems:'center'}}>
            <h2>Edit Profile</h2>
            <br/>
            <div className="postHeader">
              <div className="profileImageContainer" style={{display:'flex', alignItems:'self-start', justifyContent:'center'}}>
                <p>Profile Picture</p>
                <div style={{margin:'0px 60px'}}>
                  {selectedImage ? (
                    <img
                    src={URL.createObjectURL(selectedImage)}
                    style={{ borderRadius: "50%", width: "100px"}}
                    />
                  ) : 
                    <img
                      src={user.getUserByToken.profilePicture}
                      style={{ borderRadius: "50%", width: "100px"}}
                    />
                  }
                </div>
                <div>
                  <label htmlFor="fileInput" className='customFileInput' style={{width:'90px', padding:'0px', border:'none', color:'#3c91ff'}}>
                    Edit Profile
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .mov, .avi, .flv, .mkv, .webm"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleInputChange}
                  />
                  {isInputFilled && (
                    <div style={{color:'#3c91ff', marginTop:'60px', cursor:'pointer'}} onClick={handleSave}>Save</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="overlay">
          <LoadingIndicator loading={loading} />
        </div>
      )}
    </div>
  );
};

export default Profile;
