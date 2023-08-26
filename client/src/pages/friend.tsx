import React from "react";
import { getUser } from "../../src/components/GetUser";
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingIndicator from "../components/loadingIndicator";
import "../styles/Friend.css"
import { NavLink, useNavigate } from "react-router-dom";

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

const GET_FRIEND_REQUEST = gql`
  query GetAllFriendRequest($id:ID!){
    getAllFriendRequest(id:$id){
      id
      userID
      friendID
      status
      createDate
    }
  }
`;

const GET_FRIEND_PROFILE = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
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

const UPDATE_STATUS = gql`
  mutation UpdateStatus($userID: String!, $friendID: String!){
    updateStatus(userId:$userID, friendId:$friendID){
      id
      userID
      friendID
      status
      createDate
    }
  }
`;

const CREATE_FRIEND = gql`
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

const DELETE_FRIEND = gql`
  mutation DeleteFriend($userID:String!, $friendID: String!){
    deleteFriend(userId:$userID, friendId:$friendID){
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


const Friend = () => {
  const user = getUser();

  const {data, loading, error, refetch} = useQuery(GET_FRIEND_REQUEST, {
    variables: {
      id: user?.getUserByToken?.id
    }
  })

  const {data: suggestData, loading: suggestLoading, error:suggestError, refetch: suggestRefetch} = useQuery(SUGGESTED_FRIEND, {
    variables: {
      id: user?.getUserByToken?.id
    }
  })

  if(!user) return
  if (loading) return <p><LoadingIndicator loading={loading}/></p>;
  if (suggestLoading) return <p><LoadingIndicator loading={loading}/></p>;
  if (error) return <p>Error: {error.message}</p>;
  if (suggestError) return <p>Error: {suggestError.message}</p>;
  if(!data) return

  console.log(user.getUserByToken.id)
  console.log(data.getAllFriendRequest)
  console.log(suggestData.getUserSuggestions)
  return (
    <div style={{width:'100vw', minHeight:'100vh', position:'relative', display:'flex', justifyContent:'flex-end'}}>
      <div className="sidebar" style={{width:'20vw'}}>
        <div style={{marginTop:'70px', marginLeft:'20px'}}>
          <h2 style={{fontSize:'2vw'}}>Friends</h2>
          <ul>
            <li style={{fontSize:'1vw'}}>Home</li>
          </ul>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column', alignItems:'baseline', width:'75vw', marginTop:'64px'}}>
        <div className="friend-content" style={{marginBottom:'20px'}}>
          <h1 style={{fontSize:'2vw'}}>Friend Request</h1>
          <div style={{display:'flex'}}>
            {data.getAllFriendRequest.map((friendRequest) => (
              <div key={friendRequest.id}>
                <FriendProfilePicture friendID={friendRequest.friendID} userID={user?.getUserByToken?.id} refetch={refetch} validate="request"/>
              </div>
            ))}
          </div>
        </div>
        <div className="friend-content">
          <h1 style={{fontSize:'2vw'}}>People You May Know</h1>
          <div style={{display:'flex', flexWrap:'wrap', width:'70vw'}}>
            {suggestData.getUserSuggestions.map((suggestedFriend) => (
              <div key={suggestedFriend.id}>
                <FriendProfilePicture friendID={suggestedFriend.id} userID={user?.getUserByToken?.id} refetch={refetch} validate="suggest"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const FriendProfilePicture = ({ friendID, userID, refetch, validate }) => {
  const user = getUser();
  const navigate = useNavigate()
  const [updateStatus] = useMutation(UPDATE_STATUS)
  const [createFriend] = useMutation(CREATE_FRIEND)
  const [deleteFriend] = useMutation(DELETE_FRIEND)
  const [requestFriend] = useMutation(REQUEST_FRIEND);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const { data, loading, error } = useQuery(GET_FRIEND_PROFILE, {
    variables: {
      id: friendID,
    },
  });

  if (loading) return <LoadingIndicator loading={loading} />;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;

  const friend = data.getUser;

  const handleConfirm = () => {

    
    createNotification({
      variables: {
        inputNotification:{
          userID: friendID,
          content: "Your friend request has been accepted by " + user?.getUserByToken?.firstName,
          createDate: "",
          status: "unread",
        }
      }
    })

    updateStatus({
      variables: {
        userID: userID,
        friendID: friendID,
      },
    })

    const inputFriend = {
      userID: friendID,
      friendID: userID,
      status: "approved",
      createDate: "now"
    }

    createFriend({
      variables: {
        inputFriend: inputFriend
      },
    }).then(() => {
      refetch()
    })
  }

  const handleDelete = () => {
    deleteFriend({
      variables: {
        userID: userID,
        friendID: friendID,
      },
    }).then(() => {
      refetch()
    })
  }

  const handleAddFriend = () => {

    createNotification({
      variables: {
        inputNotification:{
          userID: friendID,
          content: "You have 1 request friend from " + user?.getUserByToken?.firstName,
          createDate: "",
          status: "unread",
        }
      }
    })

    const inputFriend = {
      userID: friendID,
      friendID: userID,
      status: "request",
      createDate: "now",
    }
    requestFriend({
      variables: {
        inputFriend: inputFriend,
      },
    }).then(() => {
      refetch()
    })
  }

  return (
    <div className="friend-card">
      <img
        src={friend.profilePicture}
        alt={friend.firstName + " " + friend.surName}
        className="friend-picture"
        onClick={() => navigate('/profile', { state: { value: { id: friendID } } })}
      />
      <div className="friend-info">
        <p className="friend-name">
          {friend.firstName} {friend.surName}
        </p>
        {validate === "request" && (
          <div className="friend-button">
            <div className="friend-confirm" onClick={handleConfirm} style={{cursor:'pointer'}}>Confirm</div>
            <div className="friend-delete" onClick={handleDelete} style={{cursor:'pointer'}}>Delete</div>
          </div>
        )}
        {validate === "suggest" && (
          <div className="friend-button">
            <div className="friend-confirm" onClick={handleAddFriend} style={{cursor:'pointer'}}>Add Friend</div>
            <div className="friend-delete" style={{cursor:'pointer'}}>Remove</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend
