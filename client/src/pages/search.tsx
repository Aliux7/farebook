import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingIndicator from "../components/loadingIndicator";
import "../styles/Search.css"
import { formatDistanceToNow } from "date-fns";
import GetAllPosts from "../components/GetAllPosts";
import { getUser } from "../components/GetUser";


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

const SEARCH_POST = gql`
  query SearchAllPost($search:String!, $offset: Int, $limit: Int){
    searchAllPost(search:$search, offset:$offset, limit:$limit){
      id
      userID
      userName
      datePost
      textPost
      privacy
    }
  }
`;

const SEARCH_USER = gql`
  query SearchAllUser($search:String!){
    searchAllUser(search:$search){
      id
      firstName
      surName
    }
  }
`;

const SEARCH_GROUP = gql`
  query SearchAllGroup($search:String!){
    searchAllGroup(search:$search){
      id
      Name
      Privacy
      CreateDate
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

const Search = () => {
  const user = getUser();
  const location = useLocation();
  const passedValue = location.state?.value.search;
  const [showGroup, setShowGroup] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showPost, setShowPost] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  const [requestFriend] = useMutation(REQUEST_FRIEND);

  const { data: dataGroup, loading: loadingGroup, error: errorGroup } = useQuery(SEARCH_GROUP, {
    variables: {
      search: passedValue,
    },
  })
  
  const { data: dataUser, loading: loadingUser, error: errorUser } = useQuery(SEARCH_USER, {
    variables: {
      search: passedValue,
    },
  })

  const { data: dataPost, loading: loadingPost, error: errorPost }  = useQuery(SEARCH_POST, {
    variables: {
      search: passedValue,
      offset: 0,
      limit: 3,
    },
  })

  const handleClickAll = () => {
    setShowGroup(true)
    setShowPeople(true)
    setShowPost(true)
  }
  
  const handleClickPost = () => {
    setShowGroup(false)
    setShowPeople(false)
    setShowPost(true)
  }

  const handleClickPeople = () => {
    setShowGroup(false)
    setShowPeople(true)
    setShowPost(false)
  }

  const handleClickGroup = () => {
    setShowGroup(true)
    setShowPeople(false)
    setShowPost(false)
  }

  const handleAddFriend = (userToAddID) => {
    
    createNotification({
      variables: {
        inputNotification:{
          userID: userToAddID,
          content: "You have 1 request friend from " + user?.getUserByToken?.firstName,
          createDate: "",
          status: "unread",
        }
      }
    })

    const inputFriend = {
      userID: userToAddID,
      friendID: user?.getUserByToken?.id,
      status: "request",
      createDate: "now",
    }
    requestFriend({
      variables: {
        inputFriend: inputFriend,
      },
    }).then(() => {
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000); 
      console.log("Successfully added");
    })
  }

  if (loadingGroup) return <div><LoadingIndicator loading={loadingGroup} /></div>;
  if (loadingUser) return <div><LoadingIndicator loading={loadingUser} /></div>;
  if (loadingPost) return <div><LoadingIndicator loading={loadingPost} /></div>;
  if (errorGroup) return <div>Error: {errorGroup.message}</div>;
  if (errorUser) return <div>Error: {errorUser.message}</div>;
  if (errorPost) return <div>Error: {errorPost.message}</div>;

  console.log(passedValue);
  console.log(dataGroup);
  console.log(dataUser);
  console.log(dataPost);
  return (
    <div className="search-container">
      <div className="sidebar">
        <h2 style={{marginBottom:'20px'}}>Search results</h2>
        <hr/>
        <h4 style={{marginTop:'20px'}}>Filters</h4>
        <ul>
          <li onClick={handleClickAll}>All</li>
          <li onClick={handleClickPost}>Posts</li>
          <li onClick={handleClickPeople}>People</li>
          <li onClick={handleClickGroup}>Groups</li>
        </ul>
      </div>
      <div className="section">
        <h2>Groups</h2>
        {dataGroup && showGroup && (
          <div>
            {dataGroup.searchAllGroup.map((group) => (
              <div key={group.id} className="group-item">
                <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" />
                <div className="item-details">
                  <h3>{group.Name}</h3>
                  <p>{group.Privacy} {formatDistanceToNow(new Date(group.CreateDate))} ago</p>
                </div>
              </div>
            ))}
            {dataGroup.searchAllGroup.length < 1 && (
              <div style={{paddingBottom:'20px'}}>
                <p>We didn't find any results</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="section">
        <h2>Users</h2>
        {dataUser && showPeople && (
          <div>
            {dataUser.searchAllUser.map((user) => (
              <div key={user.id} className="user-item">
                <div style={{display: 'flex', alignItems:'center'}}>
                  <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" />
                  <p>{user.firstName} {user.surName}</p>
                </div>
                <button onClick={(e) => handleAddFriend(user.id)}>Add a friend</button>
              </div>
            ))}
            {dataUser.searchAllUser.length < 1 && (
              <div style={{paddingBottom:'20px'}} className='no-data'>
                <p>We didn't find any results</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showPost && (
        <div className="search-post-container">
          <GetAllPosts search={passedValue}/>
        </div>
      )}
      {showSuccessPopup && (
        <div className="successPopup">
          <span>Request Friend</span>
        </div>
      )}
    </div>
  );
};

export default Search;
