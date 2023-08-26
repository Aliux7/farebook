import React, { useEffect, useState } from "react";
import '../../styles/sidebar.css'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../GetUser";
import RadioToggleGroup from "../radioToggleGroup";
import { gql, useMutation } from "@apollo/client";
import Axios from 'axios';
import GetAllUserStoryDistinct from "../GetAllUserStoryDistinct";

const CREATE_STORY = gql`
  mutation CreateStory($inputStory:NewStory!){
    createStory(inputStory:$inputStory){
      id
      userID
      userName
      dateStory
      imageStory
      textStory
      fontStory
      backgroundStory
      privacy
    }
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

const Sidebar = ({ openEditStoryUI, editTextStory, editBackgroundStory, editFontStory, imageStory, selectedFile, previewImageStoryUI, editSelectedID}) => {
  const user = getUser();
  const [isOpen, setIsOpen] = useState(true);
  const [storyUI, setStoryUI] = useState(false);
  const [createStoryUI, setCreateStoryUI] = useState(false);
  const [editStoryUI, setEditStoryUI] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const formData = new FormData();
  
  const [loading, setLoading] = useState(false);
  
  const [createMedia] = useMutation(CREATE_MEDIA);
  const [createStory] = useMutation(CREATE_STORY);
  const [textStory, setTextStory] = useState("");
  const [fontStory, setFontStory] = useState("sans-serif");
  const [backgroundStory, setBackgroundStory] = useState("red");

  const setBackground = (background: string) => {
    editBackgroundStory(background)
    setBackgroundStory(background)
  }

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleToggleSidebar = () => {
    if(location.pathname == '/story/create'){
      navigate('/story')
    }
    if(location.pathname == '/story'){
      navigate('/')
    }
  };

  const handleCreateStory = () => {
    navigate('/story/create')
  }

  const handleShareStory = () => {
    console.log("INI IMAGE STORY: " + imageStory)
    if(textStory.length < 1 && !imageStory){
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
    console.log("TEST");
    const inputStory = {
      userID: user?.getUserByToken?.id,
      userName: user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName,
      dateStory: formattedDate,
      imageStory: imageStory,
      textStory: textStory,
      fontStory: fontStory,
      backgroundStory: backgroundStory,
      privacy: "friends"
    };
    console.log(inputStory);
    createStory({
      variables: {
        inputStory: inputStory,
      },
    }).then((result) => {
      if (imageStory) {
        formData.append("file", selectedFile);
        formData.append("upload_preset", "pav17yz2");
    
        let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/';
        if (selectedFile.type.includes('image')) {
          apiUrl += 'image/upload';
        } else {
          console.log(`Unsupported file type: ${selectedFile.type}`);
        }

        Axios.post(
          apiUrl,
          formData
        ).then((response) => {
          const inputMedia = {
            postID: result.data.createStory.id,
            mediaURL: response.data.secure_url
          };
          
          createMedia({
            variables: {
              inputMedia: inputMedia,
            }
          }).then((response) => {
            setLoading(false);
          })
          console.log(response.data.secure_url);
        });
      }
      console.log(result);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/')
      }, 3000);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }
  

  useEffect(() => {
    if(location.pathname == '/story/create'){
      setCreateStoryUI(true)
      setStoryUI(false)
    }
    if(location.pathname == '/story'){
      setCreateStoryUI(false)
      setStoryUI(true)
    }

    if(openEditStoryUI === true){
      setEditStoryUI(true);
    }
    
  }, [location, openEditStoryUI])
  
    console.log(editStoryUI);
    console.log(openEditStoryUI);
  return (
    <div className='sidebar'>
        <div className="headerSidebar">
            <button className="closeButton" onClick={handleToggleSidebar}>
                X
            </button>
            <NavLink to='/' style={{  position:'absolute', margin:'8.5px 64.5px'}}><img src="/asset/miniFacebookIcon.png" alt="Facebook Icon" style={{ width:"39px", margin:"0px", padding:"0px"}}/></NavLink>
        </div>
        
        {storyUI && (
          <div>
            <div className="content" style={{marginTop: '60px', marginLeft:'3px', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{fontSize:'2vw'}}>My Story</h1>
                <i className="fa fa-cog" style={{marginRight:'4px', marginBottom:'8px', fontSize:'24px', backgroundColor:'var(--input_background)', padding:'6.5px 8px', borderRadius:'50%'}}></i>
            </div>
            <div className="content" style={{marginLeft:'3px', display:'flex', alignItems: 'center', paddingTop:'0px', cursor:'pointer' }} onClick={handleCreateStory}>
                <i className="fa fa-plus" style={{padding: '1.2vw 1.5vw', borderRadius:'50%', backgroundColor:'var(--input_background)', fontSize:'1vw'}}></i>
                <div className="content" style={{ marginLeft: '0px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginLeft: '0.1vw' }}>
                    <h2 style={{fontSize:'1vw'}}>Create a story</h2>
                    <p style={{ fontSize: '0.9vw', color: 'grey' }}>Share a photo or write something</p>
                  </div>
                </div>
            </div>
            <div>
              <GetAllUserStoryDistinct editSelectedID={editSelectedID}/>
            </div>
          </div>
        )}

        {createStoryUI && (
          <div>
            <div className="content" style={{marginTop: '60px', marginLeft:'3px', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{fontSize:'2vw'}}>My Story</h1>
                <i className="fa fa-cog" style={{marginRight:'4px', marginBottom:'8px', fontSize:'24px', backgroundColor:'var(--input_background)', padding:'6.5px 8px', borderRadius:'50%'}}></i>
            </div>
            <div className="content" style={{marginLeft:'3px', display:'flex', alignItems: 'center', paddingTop:'0px', cursor:'pointer'}} onClick={handleCreateStory}>
              <img src="/asset/navLogoProfile/defaultProfile.jpg" style={{width:'4vw', height:'4vw', borderRadius:'50%', marginTop: '13px'}}></img>
              <div style={{fontWeight:'bold', marginLeft:'15px', fontSize:'0.9vw', marginTop: '13px'}}>{user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName}</div>
            </div>
          </div>
        )}
        {createStoryUI && editStoryUI && (
          <div>
            <textarea placeholder="text" onChange={(e) => {
              editTextStory(e.target.value)
              setTextStory(e.target.value)
            }}/>
            <select onChange={(e) => {
              editFontStory(e.target.value)
              setFontStory(e.target.value)
              console.log(e.target.value)
            }}>
              <option value="san-serif">san-serif</option>
              <option value="cursive">cursive</option>
              <option value="fantasy">fantasy</option>
              <option value="monospace">monospace</option>
            </select>
            <div className="toggleBackground" style={{padding: '45px 10px'}}>
              <p style={{position:'absolute',color:'grey', top:'450px'}}>Background</p>
              <RadioToggleGroup editBackgroundStory={setBackground}/>
            </div>
          </div>
        )}
        {(previewImageStoryUI || (createStoryUI && editStoryUI)) && (
          <div>
            <button className="button cancel" onClick={handleToggleSidebar}>Cancel</button>
            <button className="button share" onClick={handleShareStory}>Share</button>
          </div>
        )}
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
    </div>
  );
};

export default Sidebar;
