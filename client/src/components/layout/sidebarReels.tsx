import React, { useEffect, useState } from "react";
import '../../styles/sidebar.css'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../GetUser";
import RadioToggleGroup from "../radioToggleGroup";
import { gql, useMutation } from "@apollo/client";
import Axios from 'axios';
import GetAllUserStoryDistinct from "../GetAllUserStoryDistinct";
import "../../styles/reels.css"
import LoadingIndicator from "../loadingIndicator";

const CREATE_REELS = gql`
  mutation CreateReels($inputReels:NewReels!){
    createReels(inputReels:$inputReels){
      id
      userID
      userName
      dateReels
      textReels
      videoURL
      privacy
    }
  }
`;

const Sidebar = ({selectedFile, setSelectedFile}) => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = new FormData();
  const [createReels] = useMutation(CREATE_REELS);
  
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [haveFile, setHaveFile] = useState(false)
  const [textareaValue, setTextareaValue] = useState("");
  const [invalidDuration, setInvalidDuration] = useState(false);
  const [invalidTextarea, setInvalidTextarea] = useState(false);

  const handleClickNext = () => {
    if (stage === 1 && !haveFile) {
      return; 
    }
    if( stage === 2 && invalidDuration ) {
      return; 
    }
    setStage(stage + 1);
  };

  const handleClickPrev = () => {
    setStage(stage - 1);
  }

  const handleFileSelect = (event) => {
    const selectedFile = event?.target?.files?.[0];
    setSelectedFile(selectedFile);
    setHaveFile(true);
    setInvalidDuration(false); // Reset invalidDuration state

    // Check video duration
    if (selectedFile) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 60) {
          setInvalidDuration(true);
        }
      };
      videoElement.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleReelsPublish = () => {
    if (!textareaValue.trim()) {
      setInvalidTextarea(true);
      return;
    }
    
    setLoading(true)
    formData.append("file", selectedFile);
    formData.append("upload_preset", "pav17yz2");
      
    let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/';
    if (selectedFile.type.includes('video')) {
      apiUrl += 'video/upload';
    } else {
      console.log(`Unsupported file type: ${selectedFile.type}`);
    }

    Axios.post(
      apiUrl,
      formData
    ).then((response) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      const inputReels = {
        userID: user?.getUserByToken?.id,
        userName: user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName,
        dateReels: formattedDate,
        textReels: textareaValue,
        videoURL: response.data.secure_url,
        privacy: 'public'
      };
      
      createReels({
        variables: {
          inputReels: inputReels,
        }
      }).then((response) => {
        setLoading(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/');
        }, 3000);
      })
    });
  }

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleToggleSidebar = () => {
    if(location.pathname == '/reels/create'){
      navigate('/reels')
    }
    if(location.pathname == '/reels'){
      navigate('/')
    }
  };

  return (
    <div className='sidebar'>
      <div className="headerSidebar">
        <button className="closeButton" onClick={handleToggleSidebar} style={{fontSize:'1.3vw'}}>
          X
        </button>
        <NavLink to='/' style={{  position:'absolute', margin:'8.5px 64.5px'}}><img src="/asset/miniFacebookIcon.png" alt="Facebook Icon" style={{ width:"2.2vw", margin:"0px", padding:"0px"}}/></NavLink>
      </div>

      {stage === 1 && (
        <div style={{margin:'80px 10px'}}>
          <p className="timeAgo" style={{fontSize:'1vw'}}>Create a reel</p>
          <h2 style={{marginLeft:'10px', fontSize:'2vw'}}>Upload video</h2>
          <label className="video-upload-button" style={{fontSize:'2vw', padding:'6vw 5vw'}}>
            Add video
            <input
              type="file"
              accept="video/*"
              capture="user"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}

      {stage === 2 && (
        <div style={{margin:'80px 10px'}}>
          <p className="timeAgo" style={{fontSize:'1vw'}}>Create a reel</p>
          <h2 style={{marginLeft:'10px', fontSize:'2vw'}}>Edit your Reels</h2>
          {invalidDuration && (
            <div>
              <p style={{color:'red', margin:'10px'}}>The video must be at least 60 seconds long.</p>
            </div>
          )}
        </div>
      )}


      {stage === 3 && (
        <div style={{margin:'80px 10px'}}>
          <p className="timeAgo" style={{fontSize:'1vw'}}>Create a reel</p>
          <textarea
            placeholder="Describe your reel..."
            style={{ margin:'10px',
            fontSize:'2vw' }}
            value={textareaValue}
            onChange={(event) => {
              setTextareaValue(event.target.value);
              setInvalidTextarea(false);
            }}
          />
          {invalidTextarea && (
            <p style={{color:'red', margin:'0px 15px'}}>Please fill in the description.</p>
          )}
        </div>
      )}

      <div className="button-container">
        {stage === 2 && (
          <>
            <button className="button cancel" onClick={handleClickPrev} style={{fontSize:'1vw'}}>
              Previous
            </button>
            <button
              className="button next"
              onClick={handleClickNext}
              style={{
                backgroundColor: haveFile ? "#3c91ff" : "gray",
                fontSize:'1vw',
              }}
            >
              Next
            </button>
          </>
        )}

        {stage === 1 && (
          <button
            className="button next"
            onClick={handleClickNext}
            style={{
              width: "100%",
              backgroundColor: haveFile ? "#3c91ff" : "gray",
              fontSize:'2vw'
            }}
            disabled={!haveFile}
          >
            Next
          </button>
        )}

        {stage === 3 && (
          <>
            <button className="button cancel" onClick={handleClickPrev} style={{fontSize:'1vw'}}>
              Previous
            </button>
            <button className="button publish" onClick={handleReelsPublish} style={{fontSize:'1vw'}}>Publish</button>
          </>
        )}
      </div>
      
      {showSuccessPopup && (
        <div className="successPopup">
          <span>Share Successful!</span>
        </div>
      )}
      {showErrorPopup && (
        <div className="errorPopup">
          <span>Share failed!</span>
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

export default Sidebar;
