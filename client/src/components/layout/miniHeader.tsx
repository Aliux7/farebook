import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import "../../styles/index.css"
import "../../styles/Header.css"
import { encryptStorage } from "../../App";
import { gql, useMutation, useQuery } from "@apollo/client";
import ReactQuill from "react-quill";
import Axios from 'axios';
import { FaSpinner } from "react-icons/fa";
import LoadingIndicator from "../loadingIndicator";
import DarkMode from "../theme/DarkMode";

const CURR_USER = gql`
  mutation GetUserByToken($token:String!){
    getUserByToken(token:$token){
      id
      profilePicture
      firstName
      surName
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($inputPost:NewPost!){
    createPost(inputPost:$inputPost){
      id
      userID
      userName
      datePost
      textPost
      privacy
    }
  }
`;

const GET_USER_NOTIFICATION = gql`
  query CountAllNotificationByUser($id:ID!){
    countAllNotificationByUser (id:$id)
  }
`;

const CREATE_MEDIA = gql`
  mutation CreateMedia($inputMedia: NewMedia!){
    createMedia(inputMedia:$inputMedia){
      id
      postID
      mediaURL
    }
  }
`;

const MiniHeader = () => {

  const [loading, setLoading] = useState(false);
  const isUserLoggedIn = encryptStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [user, setUser] = useState("");
  const [pp, setPP] = useState("");
  const [currUser] = useMutation(CURR_USER);
  const [createMedia] = useMutation(CREATE_MEDIA);

  const { data: userNotificationData } = useQuery(GET_USER_NOTIFICATION, {
    variables: {
      id: id, // Use the id obtained from useMutation
    },
  });
  
  const [numberNotification, setNumberNOtification] = useState(0)
  useEffect(() => {
    if(userNotificationData?.countAllNotificationByUser){
      setNumberNOtification(userNotificationData.countAllNotificationByUser)
    }
  }, [userNotificationData?.countAllNotificationByUser])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await currUser({
          variables: {
            token: isUserLoggedIn,
          },
        });
        console.log(result.data.getUserByToken.id)
        setId(result.data.getUserByToken.id);
        setUser(result.data.getUserByToken.firstName + " " + result.data.getUserByToken.surName);
        setPP(result.data.getUserByToken.profilePicture);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, [currUser, isUserLoggedIn]);

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const toggleDropdownMenu = () => {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
    setIsDropdownNotificationOpen(false);
    setIsDropdownProfileOpen(false);
  };

  const [isDropdownNotificationOpen, setIsDropdownNotificationOpen] = useState(false);
  const toggleDropdownNotification = () => {
    setIsDropdownNotificationOpen(!isDropdownNotificationOpen);
    setIsDropdownMenuOpen(false);
  };

  const [isDropdownProfileOpen, setIsDropdownProfileOpen] = useState(false);
  const toggleDropdownProfile = () => {
    setIsDropdownProfileOpen(!isDropdownProfileOpen);
    setIsDropdownMenuOpen(false);
    setIsDropdownNotificationOpen(false);
  };
  
  const logoutAction = () => {
    encryptStorage.clear();
    window.location.reload();
    navigate('/login');
  };  

  const [fileSelected, setFileSelected] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [textPost, setTextPost] = useState("");
  const handlePostClick = () => {
    setIsPostOpen(true);
    setIsDropdownMenuOpen(false);
  };

  const handleClosePost = () => {
    setIsPostOpen(false);
  };

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formData = new FormData();
  const handleFileChange = (e) => {
    if(selectedFiles && selectedFiles?.length < 10){
      const newSelectedFiles = e.target.files;
      setSelectedFiles((prevMedia) => prevMedia ? [...prevMedia, ...newSelectedFiles] : newSelectedFiles);
    }
  };

  console.log(selectedFiles);

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevMedia) => {
      const updatedMedia = [...prevMedia];
      updatedMedia.splice(index, 1); // Remove the selected image at the specified index
      return updatedMedia;
    });
  };

  const [images, setImages] = useState<JSX.Element[] | null>(null);
  useEffect(() => {
    if (selectedFiles) {
      const newImages = Array.from(selectedFiles).map((file, index) => (
        <img
          key={index}
          src={URL.createObjectURL(file)}
          alt={`Image ${index + 1}`}
          style={{ width: '100px', height: '100px', margin: '10px' }}
          onClick={() => handleRemoveImage(index)}
        />
      ));
      setImages(newImages);
    }
  }, [selectedFiles]);
  
  const dropdownRefs = [
    useRef<HTMLDivElement | null>(null), // Menu dropdown ref
    useRef<HTMLDivElement | null>(null), // Messenger dropdown ref
    useRef<HTMLDivElement | null>(null), // Notification dropdown ref
    useRef<HTMLDivElement | null>(null), // Profile dropdown ref
  ];

  useEffect(() => {
    setIsDropdownProfileOpen(true);
    setTimeout(() => {
      setIsDropdownProfileOpen(false);
    }, 1);

    const closeDropdownOnOutsideClick = (event) => {
      console.log("Event target:", event.target);
      if (!dropdownRefs.some(ref => ref.current && ref.current.contains(event.target))) {
        setIsDropdownMenuOpen(false);
        setIsDropdownNotificationOpen(false);
        setIsDropdownProfileOpen(false);
      }
    };

    document.addEventListener("click", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeDropdownOnOutsideClick);
    };
  }, []);

  

  
  const [createPost] = useMutation(CREATE_POST);
  const handleSubmitPost = () => {

    if(textPost.length < 1){
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return
    }


    setLoading(true)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const inputPost = {
      userID: id,
      userName: user,
      datePost: formattedDate,
      textPost: textPost,
      privacy: privacy
    };
    createPost({
      variables: {
        inputPost: inputPost,
      },
    }).then((result) => {
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("file", selectedFiles[i]);
          formData.append("upload_preset", "pav17yz2");
      
          let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/';
          if (selectedFiles[i].type.includes('image')) {
            apiUrl += 'image/upload';
          } else if (selectedFiles[i].type.includes('video')) {
            apiUrl += 'video/upload';
          } else {
            console.log(`Unsupported file type: ${selectedFiles[i].type}`);
            continue;
          }

          Axios.post(
            apiUrl,
            formData
          ).then((response) => {
            const inputMedia = {
              postID: result.data.createPost.id,
              mediaURL: response.data.secure_url
            };
            
            createMedia({
              variables: {
                inputMedia: inputMedia,
              }
            }).then((response) => {
              if(i == selectedFiles.length - 1){
                setLoading(false);
              }
            })
            console.log(response.data.secure_url);
          });
        }
      }else{
        setLoading(false);
      }
      console.log(result);
    })
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
    setIsPostOpen(false);
  }

  console.log(isDropdownProfileOpen)
  return (
    <div className="MiniheaderContainer" style={{zIndex: 100, position:'absolute', right:'25px', top:'6.5px'}}>
      <div className="headerRight">
        {isUserLoggedIn && (
          <div className="user">
            <div className="profile-dropdown" ref={dropdownRefs[0]}>
              <div className="eachIconProfile" onClick={toggleDropdownMenu}>
                <img src="/asset/navLogoProfile/unselectedDots.png" style={{width:'21px', height:'20px'}}></img>
              </div>
              {isDropdownMenuOpen && (
                <div className="dropdown-content">
                  <h1 style={{paddingBottom:'10px'}}>Menu</h1>
                  <div style={{backgroundColor: 'var(--body_background)', borderRadius:'5px'}}>
                    <h3 style={{padding: '10px', paddingBottom:'0px'}}>Create</h3>
                    <ul>
                      <li onClick={handlePostClick}>Post</li>
                      <li onClick={() => navigate('/story')}>Story</li>
                      <li onClick={() => navigate('/reels')}>Reels</li>
                      <li onClick={() => navigate('/forum')}>Forum</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-dropdown" ref={dropdownRefs[2]}>
              <div className="eachIconProfile" onClick={() => navigate('/notification')}>
                <img src="/asset/navLogoProfile/unselectedNotification.png" style={{width:'21px', height:'20px'}}></img>
              </div>
              {numberNotification > 0 && (
                <div className="notificationCount">{numberNotification}</div>
              )}
            </div>

            <div className="profile-dropdown" ref={dropdownRefs[3]}>
              <div className="profile-icon" onClick={toggleDropdownProfile}>
                <img src={pp} style={{width:'41px', height:'41px', borderRadius:'50%', marginTop: '2px'}}></img>
              </div>
              {isDropdownProfileOpen && (
                <div className="dropdown-content">
                  <ul>
                    <li onClick={() => navigate('/profile')}>{user}</li>
                    <li>Profile</li>
                    <li>Settings</li>
                    <li><DarkMode/></li>
                    <li onClick={logoutAction}>
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Pop Up */}
      {isPostOpen && (
        <div className="overlay" onClick={handleClosePost}>
          <div className="createPostContainer" onClick={(e) => e.stopPropagation()}>
            <h2>Create Post</h2>
            <hr/>
            <div className="postHeader">
              <div className="profileImageContainer">
                <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" style={{ width: '41px', height: '40px', borderRadius: '50%' }} />
              </div>
              <div className="userInfo">
                <h4>{user}</h4>
                <select value={privacy} onChange={handlePrivacyChange}>
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="specific-friends">Specific Friends</option>
                </select>
              </div>
            </div>
            <ReactQuill   
              className="inputRichText"
              theme="snow" 
              value={textPost} 
              onChange={setTextPost}
              placeholder="What do you think?"/>
            <div className="grid-container">
              {images && images.length > 0 && (
                <div className="grid">
                  {images}
                </div>
              )}
            </div>
            <label htmlFor="fileInput" className={`customFileInput ${fileSelected ? 'fileSelected' : ''}`}>
              Add to Your Posts
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .mov, .avi, .flv, .mkv, .webm"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                handleFileChange(e)
                setFileSelected(1 > 0); 
              }}
            />
            <div className="inputBox">
              <input type="submit" value="Submit" onClick={handleSubmitPost} style={{marginTop:'10px', cursor:'pointer', padding:"10px 0px", backgroundColor:"#2374e1"}}/>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="successPopup">
          <span>Create Post Success!</span>
        </div>
      )}
      {showErrorPopup && (
          <div className="errorPopup">
            <span>Text Content must be filled</span>
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

export default MiniHeader;
