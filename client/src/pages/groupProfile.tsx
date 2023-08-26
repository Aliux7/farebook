import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loadingIndicator";
import UserObjectList from "../components/UserObjectList";
import { getUser } from "../components/GetUser";
import GetAllGroupPostByGroupID from "../components/GetAllGroupPostByGroupID";
import ReactQuill from "react-quill";
import Axios from 'axios';
import TwoColumnList from "../components/TwoColumnList";


const GET_GROUP_DATA = gql`
  query GetGroupByID($id:String!){
    getGroupByID(id:$id){
      id
      Name
      Privacy
      CreateDate
    }
  }
`;

const GET_ALL_MEMBER = gql`
  query GetAllMemberByGroupID($groupID: String!){
    getAllMemberByGroupID(GroupID: $groupID){
      id
      GroupID
      UserID
      Role
    }
  }
`;

const CREATE_GROUP_POST = gql`
  mutation CreateGroupPost($inputGroupPost:NewGroupPost!){
    createGroupPost(inputGroupPost:$inputGroupPost){
      id
      groupID
      userID
      userName
      datePost
      textPost
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

const DELETE_MEMBER = gql`
  mutation GeleteGroupMember($id:ID!){
    deleteGroupMember(id:$id){
      id
      GroupID
      UserID
    }
  }
`;

const CREATE_GROUP_FILE = gql`
  mutation CreateFile($inputFile: NewGroupFile!){
    createFile(inputFile: $inputFile){
      id
      groupID
      userID
      fileName
      type
      mediaURL
      createDate
    }
  }
`;

const Get_All_Files =  gql`
  query GetAllFilesByGroupID($groupID: String!){
    getAllFilesByGroupID(groupID: $groupID){
      id
      groupID
      userID
      fileName
      type
      mediaURL
      createDate
    }
  }
`;

const CREATE_GROUP_CHAT = gql`
  mutation CreateGroupChat{
    createGroupChat{
      id
      CreatedAt
    }
  }
`;


const CREATE_MEMBER_GROUP = gql`
  mutation CreateGroupChatMember($inputGroupChatMember: NewGroupChatMember!){
    createGroupChatMember(inputGroupChatMember: $inputGroupChatMember){
      id
      ChatID
      UserID
      CreatedAt
    }
  }
`;

const CREATE_GROUP_CHAT_MESSAGE = gql`
  mutation CreateGroupChatMessage($inputGroupChatMessage:NewGroupChatMessage!){
    createGroupChatMessage(inputGroupChatMessage:$inputGroupChatMessage){
      id
      ChatID
      Sender
      Content
      Timestamp
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateRoleMember($groupID: String!, $userID: String!, $role: String!){
    updateRoleMember(groupID: $groupID, userID: $userID, role: $role){
      id
      GroupID
      UserID
      Role
    }
  }
`;

const GroupProfile = () => {
    
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const passedValue = location.state?.value.groupID;
  
  const [createPost] = useMutation(CREATE_GROUP_POST);
  const [createMedia] = useMutation(CREATE_MEDIA);
  const [deleteMember] = useMutation(DELETE_MEMBER);
  const [createFile] = useMutation(CREATE_GROUP_FILE);
  const [updateRole] = useMutation(UPDATE_ROLE);

  
  const [createGroup] = useMutation(CREATE_GROUP_CHAT);
  const [addGroupMember] = useMutation(CREATE_MEMBER_GROUP);
  const [sendGroupMessage] = useMutation(CREATE_GROUP_CHAT_MESSAGE);

  const [isAbouts, setIsAbouts] = useState(false);
  const [isPosts, setIsPosts] = useState(true);
  const [showMember, setShowMember] = useState(false);
  const [isFiles, setIsFiles] = useState(false);
  const [isInvite, setIsInvite] = useState(false);

  const [fileSelected, setFileSelected] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [textPost, setTextPost] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const {data, loading: loadingGroupData} = useQuery(GET_GROUP_DATA, {
    variables: {
      id: passedValue
    }
  })

  const {data: memberData, loading: memberLoading, refetch: refetchMember} = useQuery(GET_ALL_MEMBER, {
    variables: {
      groupID: passedValue
    }
  })

  const {data: fileData, loading: loadingFile} = useQuery(Get_All_Files, {
    variables: {
      groupID: passedValue
    }
  })
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formData = new FormData();
  const handleFileChange = (e) => {
    if(selectedFiles && selectedFiles?.length < 10){
      const newSelectedFiles = e.target.files;
      setSelectedFiles((prevMedia) => prevMedia ? [...prevMedia, ...newSelectedFiles] : newSelectedFiles);
    }
  };

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
  
  console.log(memberData?.getAllMemberByGroupID)
  if(loadingGroupData) return <LoadingIndicator loading={loadingGroupData}/>
  if(loadingFile) return <LoadingIndicator loading={loadingFile}/>
  if(memberLoading) return <LoadingIndicator loading={memberLoading}/>
  
  
  const postOnClick = () => {
    setShowMember(false);
    setIsPosts(true)
    setIsFiles(false)
  }

  const memberOnClick = () => {
    setShowMember(true);
    setIsPosts(false)
    setIsFiles(false)
  }

  const filesOnClick = () => {
    setShowMember(false);
    setIsPosts(false)
    setIsFiles(true)
  }


  const handlePostClick = () => {
    setIsPostOpen(true);
  };

  const handleClosePost = () => {
    setIsPostOpen(false);
    setIsInvite(false);
  };

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleLeave = (memberId) => {
    deleteMember({
      variables: {
        id: memberId
      }
    })
    navigate('/group')
  }
  
  const handleSubmitPost = () => {
    
    if(isPosts){
      if(textPost.length < 1){
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
        return
      }
  
      setLoading(true)
      
      const inputGroupPost = {
        groupID: passedValue,
        groupName: data?.getGroupByID?.Name,
        userID: user?.getUserByToken?.id,
        userName: user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName,
        datePost: "",
        textPost: textPost,
        privacy: privacy
      };
      createPost({
        variables: {
          inputGroupPost: inputGroupPost,
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
                  postID: result.data.createGroupPost.id,
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
    }else{
      setLoading(true)
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

              const inputFile = {
                groupID: passedValue, 
                userID: user?.getUserByToken?.id,
                fileName: selectedFiles[i].name,
                type: selectedFiles[i].type,
                mediaURL: response.data.secure_url,
                createDate: "now",
              };
              
            createFile({
              variables: {
                inputFile: inputFile,
              }
            }).then((response) => {
              setLoading(false);
            })
          });
        }
      }else{
        setLoading(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        setIsPostOpen(false);
        setIsPostOpen(false);
      }
    }
  }

  const downloadFile = async (mediaURL, fileName) => {
    const fileUrl = mediaURL;
    const response = await fetch(fileUrl);
    const blob = await response.blob();
  
    // Extract the file extension from the mediaURL
    const existingExtension = mediaURL.substring(mediaURL.lastIndexOf(".") + 1);
  
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
  
    // Set the desired file name with the extracted extension
    link.download = `${fileName}.${existingExtension}`;
  
    link.click();
  
    window.URL.revokeObjectURL(url); // Clean up the URL object
  };
  
  console.log(fileData?.getAllFilesByGroupID)

  const createGroupChat = async () => {
    try {
      const result = await createGroup();
      const chatId = result.data.createGroupChat.id;
  
      if (memberData && memberData.getAllMemberByGroupID) {
        for (const member of memberData.getAllMemberByGroupID) {
          await addGroupMember({
            variables: {
              inputGroupChatMember: {
                ChatID: chatId,
                UserID: member.UserID,
              },
            },
          });
        }
      }
  
      navigate('/messenger');
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };
  
  const handleRoleSelection = (role, memberId) => {
    if(role === 'Kick'){
      deleteMember({
        variables: {
          id: memberId
        }
      })
      navigate('/group')
    }else{
      updateRole({
        variables: {
          groupID: passedValue, 
          userID: user?.getUserByToken?.id,
          role: role
        }
      }).then(() => {
        refetchMember();
      })
    }
    console.log("Selected Role:", role);
    console.log("Selected Role:", memberId);
  };

  return (
    <div style={{width:'100vw', minHeight:'100vh', position:'relative', display:'flex', justifyContent:'flex-end'}}>
      <div className="sidebar" style={{position:'sticky', top:'0px', left:'0px', height:'100vh', width:'20vw'}}>
        <div style={{marginTop:'80px', marginLeft:'20px'}}>
          
          <div style={{width:'10vw', margin:'1vw', fontSize:'1.3vw', backgroundColor:'#336db4', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px', cursor:'pointer'}} onClick={() => createGroupChat()}>Create Chat</div>
        </div>
      </div>
      <div className="group-preview-container" style={{padding:'5vw', width:'80vw'}}>
        <div>
          <img src="/asset/defaultBackground.png" style={{width:'100%'}}/>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                <div style={{height:'50px', padding:'10px'}}>
                    <h1>{data.getGroupByID.Name}</h1>
                </div>
                <p className="timeAgo" style={{fontSize:'15px'}}>{data.getGroupByID.Privacy} group - {memberData?.getAllMemberByGroupID?.length} member</p>
            </div>
            <div style={{width:'10vw', margin:'1vw', fontSize:'1.3vw', backgroundColor:'#336db4', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px', cursor:'pointer'}} onClick={() => setIsInvite(true)}>+ Invite</div>
            
            {memberData?.getAllMemberByGroupID?.some(member => member.UserID === user?.getUserByToken?.id) ? (
              <div style={{width:'10vw', margin:'1vw', fontSize:'1.3vw', backgroundColor:'grey', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px', cursor:'pointer'}}>
                <p onClick={() => handleLeave(memberData?.getAllMemberByGroupID?.find(member => member.UserID === user?.getUserByToken?.id)?.id)}>Leave</p>
              </div>
            ) : null}
          </div>
          <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div style={{border:'1px solid grey', width:'98%', margin:'10px 0px'}}></div>
          </div>
          <div style={{display:'flex'}}>
              <div style={{margin:'10px', fontWeight:'bold', cursor:'pointer'}} className="timeAgo">About</div>
              <div style={{margin:'10px', fontWeight:'bold', cursor:'pointer'}} className="timeAgo" onClick={postOnClick}>Posts</div>
              <div style={{margin:'10px', fontWeight:'bold', cursor:'pointer'}} className="timeAgo" onClick={memberOnClick}>Members</div>
              <div style={{margin:'10px', fontWeight:'bold', cursor:'pointer'}} className="timeAgo" onClick={filesOnClick}>Files</div>
          </div>
          
          {isPosts && (
            <div style={{marginTop:'1vw', display:'flex', justifyContent:'space-between'}}>
              <div>
                <div style={{width:'43vw', backgroundColor:'var(--header_background)', height:'10vw', borderRadius:'10px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <input type="text" name="search" id="search" placeholder="Search Facebook" style={{backgroundColor:'var(--input_background)', border:'0', width:'80%', marginTop:'1vw', padding:'1vw', borderRadius:'10px'}}/>
                  <div style={{border:'1px solid var(--input_background)', width:'80%', margin:'1vw'}}></div>
                  <div style={{display:'flex', justifyContent:'space-between', width:'80%'}}>
                    <div className="group-page-options-create-photo">Anonymous Post</div>
                    <div className="group-page-options-create-photo" onClick={handlePostClick}>Photo/Video</div>
                    <div className="group-page-options-create-photo">Room</div>
                  </div>
                </div>
                <div style={{width:'43vw',  height:'10vw', borderRadius:'10px', display:'flex', flexDirection:'column', alignItems:'center', margin:'2vw 0vw'}}>
                  <GetAllGroupPostByGroupID user={user} search="" group_id={passedValue}/>
                </div>
              </div>
              

              <div style={{width:'25vw', backgroundColor:'var(--header_background)', height:'100vw', borderRadius:'10px'}}>

              </div>
            </div>
          )}

          {showMember && (
            <div style={{display:'flex'}}>
              <div style={{backgroundColor:'var(--body_background)', borderRadius:'5px', width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-start', }}>
                  <div style={{backgroundColor:'var(--header_background)', display:'flex', flexDirection:'column', width:'70%', margin:'10px 3px 10px 10px', padding:'20px 10px 10px 20px', borderRadius:'10px'}}>
                      <h4>Member</h4>
                      <div style={{margin:'20px'}}>
                        {memberData?.getAllMemberByGroupID.map((member) => (
                          <div key={member.UserID} style={{display:'flex'}}>
                            <UserObjectList userID={member.UserID} role={member.Role} search=""/>
                            <RoleSelectionPopup onSelectRole={handleRoleSelection} memberId={member.id} />
                          </div>
                        ))}
                      </div>
                  </div>
              </div>
          </div>
          )}

          {isFiles && (
            <div style={{display:'flex'}}>
              <div style={{backgroundColor:'var(--body_background)', borderRadius:'5px', width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-start', }}>
                  <div style={{backgroundColor:'var(--header_background)', display:'flex', flexDirection:'column', width:'70%', margin:'10px 3px 10px 10px', padding:'20px 10px 10px 20px', borderRadius:'10px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h4>Files</h4>
                      <div style={{width:'40%', display:'flex', alignItems:'center'}}>
                        <input type="text" name="search" id="search" placeholder="Search Facebook" style={{backgroundColor:'var(--input_background)', border:'0', width:'10vw', padding:'0.5vw', borderRadius:'30px', marginRight:'1vw'}}/>
                        <div onClick={handlePostClick}>Upload File</div>
                      </div>
                    </div>
                    <div style={{border:'1px solid grey', margin:'1vw 0px'}}></div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                      <div style={{display:'flex', flexDirection:'column', width:'50%'}}>
                        <h1 style={{fontSize:'1vw'}}>File Name</h1>
                        {fileData?.getAllFilesByGroupID?.map((fileName) => (
                          <div onClick={() => downloadFile(fileName.mediaURL, fileName.fileName)}>
                            {fileName.fileName}
                          </div>
                        ))}
                      </div>
                      <div style={{display:'flex', flexDirection:'column', width:'20%'}}>
                        <h1 style={{fontSize:'1vw'}}>Type</h1>
                        {fileData?.getAllFilesByGroupID?.map((type) => (
                          <div>
                            {type.type}
                          </div>
                        ))}
                      </div>
                      <div style={{display:'flex', flexDirection:'column', width:'30%'}}>
                        <h1 style={{fontSize:'1vw'}}>Uploaded Date</h1>
                        {fileData?.getAllFilesByGroupID?.map((createData) => (
                          <div>
                            {createData.createDate}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          )}
      </div>
      </div>
      {isInvite && (
        <div className="overlay" onClick={handleClosePost}>
         <div className="createPostContainer" onClick={(e) => e.stopPropagation()}>
            <TwoColumnList groupID={data.getGroupByID.id} setInvite={setIsInvite}/>
          </div>
        </div>
      )}

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
                <h4>{user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName}</h4>
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

const RoleSelectionPopup = ({ onSelectRole, memberId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const handleRoleSelect = (role, memberId) => {
    setSelectedRole(role);
    setSelectedMemberId(memberId); 
  };
  

  const handleConfirm = () => {
    onSelectRole(selectedRole, selectedMemberId);
    setIsOpen(false);
  };

  console.log("Babi" + memberId)
  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        style={{ cursor: "pointer"}}
      >
        ...
      </div>
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <div onClick={() => handleRoleSelect("Admin", memberId)} style={{cursor:'pointer'}}>Admin</div>
            <div onClick={() => handleRoleSelect("Group Expert", memberId)} style={{cursor:'pointer'}}>Group Expert</div>
            <div onClick={() => handleRoleSelect("Member", memberId)} style={{cursor:'pointer'}}>Member</div>
            <div onClick={() => handleRoleSelect("Kick", memberId)} style={{cursor:'pointer'}}>Kick</div>
            <div onClick={handleConfirm}>Confirm</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupProfile;
