import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loadingIndicator";
import { getUser } from "../components/GetUser";
import Axios from 'axios';
import GetUserPosts from "../components/GetUserPosts";
import UserObjectList from "../components/UserObjectList";
import FriendObjectList from "../components/FriendObjectList ";


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


const GET_USER = gql`
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

const GET_ALL_FRIENDS = gql`
  query GetAllFriends($id: ID!){
    getAllFriends(id:$id){
      id
      userID
      friendID
      status
      createDate
    }
  }
`;


const SUGGESTED_FRIEND = gql`
  query GetUserSuggestions($id: ID!) {
    getUserSuggestions(id: $id){
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

const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($inputNotification:NewNotification!){
    createNotification(inputNotification: $inputNotification){
      id
      userID
      content
      createDate
      status
    }
  }
`;

const REQUEST_FRIEND = gql`
  mutation CreateFriend($inputFriend:NewFriend!){
    createFriend(inputFriend:$inputFriend){
      id
      userID
      friendID
      status
      createDate
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($inputChat: NewChat!){
    createChat(inputChat:$inputChat){
      id
      userID1
      userID2
      createdAt
    }
  }
`;

const GET_USER_REELS = gql`
  query GetALlReelsByUserID($userID: ID!){
    getAllReelsByUserID(userID:$userID){
      userID
      userName
      dateReels
      textReels
      videoURL
      privacy
    }
  }
`;
const UserProfile = () => {
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const formData = new FormData();
  const currUser = getUser();
  const location = useLocation();
  const id = location.state?.value?.id;
  const [requestFriend] = useMutation(REQUEST_FRIEND);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [loading, setLoading] = useState(false);

  const [isPosts, setIsPosts] = useState(true);
  const [isFriends, setIsFriends] = useState(false);
  const [isReels, setIsReels] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [updateProfilePicture] = useMutation(UPDATE_USER);


  const [createChat] = useMutation(CREATE_CHAT);
  
  const {data: user, loading: userLoading, error}= useQuery(GET_USER, {
    variables: {
      id: id,
    }
  })
  
  const {data: allFriendsData, loading: friendsLoading} = useQuery(GET_ALL_FRIENDS, {
    variables: {
      id: id,
    },
  }) 

  const {data: allSuggestedFriend, loading: suggestedLoading} = useQuery(SUGGESTED_FRIEND, {
    variables: {
      id: id,
    },
  }) 

  const {data: allUserReels, loading: reelsLoading} = useQuery(GET_USER_REELS, {
    variables: {
      userID: id,
    }
  })

  const [friendProfilePictures, setFriendProfilePictures] = useState({});
  useEffect(() => {
    if (!friendsLoading) {
      const friendIDs = allFriendsData?.getAllFriends?.map((friend) => friend.friendID) || [];
      const fetchFriendProfilePictures = async () => {
        const pictures = {};
        for (const friendID of friendIDs) {
          const { data } = await apolloClient.query({
            query: GET_USER,
            variables: { id: friendID },
          });
          if (data && data.getUser) {
            pictures[friendID] = data.getUser.profilePicture;
          }
        }
        setFriendProfilePictures(pictures);
      };
      fetchFriendProfilePictures();
    }
  }, [allFriendsData, friendsLoading]);
  
  if(userLoading) return <LoadingIndicator loading={userLoading}/>
  if(friendsLoading) return <LoadingIndicator loading={friendsLoading}/>
  if(suggestedLoading) return <LoadingIndicator loading={suggestedLoading}/>
  if(reelsLoading) return <LoadingIndicator loading={reelsLoading}/>
  if(!user) return <LoadingIndicator loading={userLoading}/>
  
  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const closeEditProfilePopup = () => {
    setIsEditProfileOpen(false);
    setIsInputFilled(false);
    setSelectedImage(null);
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
              id: user?.getUser.id,
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

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    setIsInputFilled(file && file.type.includes("image")); 
    setSelectedImage(file);
  };

  const handleAddFriend = (friendID) => {
    createNotification({
      variables: {
        inputNotification:{
          userID: friendID,
          content: "You have 1 request friend from " + currUser?.getUserByToken?.firstName,
          createDate: "",
          status: "unread",
        }
      }
    })
    const inputFriend = {
      userID: friendID,
      friendID: currUser?.getUserByToken?.id,
      status: "request",
      createDate: "now",
    }
    requestFriend({
      variables: {
        inputFriend: inputFriend,
      },
    })
  }
  
  const handleMessage = () => {
    createChat({
      variables: {
        inputChat: {
          userID1: currUser?.getUserByToken?.id,
          userID2: user?.getUser?.id,
        },
      },
     }).then(() => {
        navigate('/messenger')
     })
  }

  console.log(user?.getUser)
  console.log(allFriendsData?.getAllFriends)
  console.log(friendProfilePictures)

  return (
    <div style={{}}>
      <div style={{ backgroundColor: 'var(--header_background)', width: '100vw', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <img style={{ width: "70vw", height: "30vw", borderRadius: "20px" }} src="https://res.cloudinary.com/dz7mnls0q/image/upload/v1691982045/Wallpaper_czhfqk.jpg" alt="Background" />
        <div className="user-profile-page" style={{display:'flex', justifyContent:'space-between', marginTop:'-3vw'}}>
          <div style={{width:'30vw', display:'flex', alignItems:'end'}}>
            <img style={{ borderRadius: "50%", width: "15vw", border: '5px solid var(--body_background)' }} src={user.getUser.profilePicture} alt="Profile" />
            <div style={{display:'flex', flexDirection:'column', marginBottom:'2vw'}}>
              <h2 style={{ marginLeft: "10px", fontSize:'1.6vw' }}>{user.getUser.firstName + " " + user.getUser.surName}</h2>
              <p className="timeAgo" style={{fontSize:'0.9vw', marginBottom:'1vw'}}>{user.getUser.email} &#x2022; {user.getUser.gender} &#x2022; <br/>{allFriendsData?.getAllFriends?.length} friends </p>
              <div style={{display:'flex', marginLeft:'10px'}}>
                {allFriendsData?.getAllFriends.map((friend) => (
                  <img style={{width:'1.5vw', borderRadius:'50%', marginLeft:'-5px'}} src={friendProfilePictures[friend.friendID]} alt={`Friend ${friend.friendID}`} key={friend.friendID} />
                ))}
              </div>
            </div>
          </div>
          <div style={{width:'10vw'}}></div>
          <div style={{width:'30vw', display:'flex', justifyContent:'end', alignItems:'end'}}>
            <div style={{display:'flex', marginBottom:'2vw'}}>
              <div style={{backgroundColor:'#3c91ff', padding:'13px', marginRight:'1vw', borderRadius:'10px'}}>+ Add to story</div>
              {currUser.getUserByToken.id === user.getUser.id ? (
                <div style={{backgroundColor:'var(--scroll_background)', padding:'13px', marginRight:'1vw', borderRadius:'10px', cursor:'pointer'}} onClick={handleEditProfileClick}>Edit profile</div>
                ) : (
                <div style={{backgroundColor:'var(--scroll_background)', padding:'13px', marginRight:'1vw', borderRadius:'10px', cursor:'pointer'}} onClick={handleMessage}>Message</div>
              )}
            </div>
          </div>
        </div>
        <div style={{width:'70vw', display:'flex', justifyContent:'start', flexDirection:'column', margin:'3vw', border:'1px solid #555555', borderRadius:'10px', padding:'1.5vw'}}>
          <h3 style={{fontSize:'1.3vw'}}>People You May Know</h3>
          <div style={{display:'flex', overflowX:'scroll', padding:'1vw 0px'}}>
            {allSuggestedFriend.getUserSuggestions.map((suggest) => (
              <div style={{border:'1px solid #555555', borderRadius:'15px 15px 15px 15px', display:'flex', flexDirection:'column', alignItems:'center', marginRight:'1vw', paddingBottom:'1vw'}}>
                <img src={suggest?.profilePicture} style={{width:'12vw', borderRadius:'15px 15px 0px 0px', height:'12vw'}}/>
                <div style={{fontSize:'1.3vw', margin:'0.5vw'}}>{suggest?.firstName + " " + suggest?.surName}</div>
                <div style={{backgroundColor:'#3c91ff', padding:'0.5vw 1.4vw', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => handleAddFriend(suggest.id)}>Add Friend</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{border:'1px solid #555555', width:'70vw'}}></div>
        <div style={{width:'70vw', display:'flex', margin:'2vw', justifyContent:'start'}}>
          <div style={{margin:'1vw', cursor:'pointer'}} onClick={() => {setIsPosts(true), setIsFriends(false), setIsReels(false)}}>Posts</div>
          <div style={{margin:'1vw', cursor:'pointer'}}>About</div>
          <div style={{margin:'1vw', cursor:'pointer'}} onClick={() => {setIsPosts(false), setIsFriends(true), setIsReels(false)}}>Friends</div>
          <div style={{margin:'1vw', cursor:'pointer'}}>Photo</div>
          <div style={{margin:'1vw', cursor:'pointer'}} onClick={() => {setIsPosts(false), setIsFriends(false), setIsReels(true)}}>Videos</div>
          <div style={{margin:'1vw', cursor:'pointer'}}>Check-ins</div>
          <div style={{margin:'1vw', cursor:'pointer'}}>More</div>
        </div>
      </div>
      <div style={{ width: '100vw', marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
        {isPosts && (
          <div style={{width:'70vw', display:'flex', justifyContent:'space-between'}}>
            <div style={{width:'19vw'}}>
              asd
            </div>
            <div style={{width:'41vw'}}>
              <GetUserPosts userID={id} search=""/>
            </div>
          </div>
        )}
        {isFriends && (
          <div style={{width:'70vw', display:'flex', flexDirection:'column', backgroundColor:'var(--header_background)', padding:'2vw', borderRadius:'10px'}}>
            <h2>Friends</h2>
            <div style={{display:'flex', width:'70vw', flexWrap:'wrap'}}>
              {allFriendsData?.getAllFriends.map((friend) => (
                <div style={{display:'flex'}}>
                  <FriendObjectList userID={friend.friendID}/>
                </div>
              ))}
            </div>
          </div>
        )}
        {isReels && (
          <div style={{width:'70vw', display:'flex', flexDirection:'column', backgroundColor:'var(--header_background)', padding:'2vw', borderRadius:'10px'}}>
            <h2>Reels</h2>
            <div style={{display:'flex', width:'70vw', flexWrap:'wrap', marginTop:'1vw'}}>
              {allUserReels?.getAllReelsByUserID.map((reels) => (
                  <video autoPlay src={reels.videoURL} style={{width:'20vw', height:'15vw', aspectRatio:'3/2', objectFit:'contain'}} onClick={() => navigate('/reels')}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditProfileOpen && (
        <div className="overlay" onClick={closeEditProfilePopup}>
          <div className="createPostContainer" onClick={(e) => e.stopPropagation()} style={{display:'flex', alignItems:'center'}}>
            <h2>Edit Profile</h2><br/>
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
                      src={user?.getUser?.profilePicture}
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

export default UserProfile;
