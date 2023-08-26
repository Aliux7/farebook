import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import '../styles/Story.css'

const LOAD_STORY = gql`
  query GetUserStoryDistinct{
    getUserStoryDistinct{
      userID
      userName
    }
  }
`;

interface UserStory {
  userID: string;
  userName: string;
}

const GetAllUserStoryDistinct = ({editSelectedID}) => {
  const { error, loading, data, refetch } = useQuery(LOAD_STORY);
  const [usersStory, setUsersStory] = useState<UserStory[]>([]);
  
  useEffect(() => {
    if (data) {
      setUsersStory(data.getUserStoryDistinct);
    }
  }, [data])

  return (
    <div style={{margin:'0px 25px'}}>
      <h2 style={{fontSize:'2vw'}}>All Stories</h2>
      {usersStory.map((userStory) => (
        <div className="userStory" style={{margin:'20px 0px', display:'flex', alignItems:'center', cursor:'pointer', padding:'10px', borderRadius:'10px'}} onClick={(e) => editSelectedID(userStory.userID)}>
          <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" className="profileImage" style={{marginRight:'20px', width:'4vw', height:'4vw'}}/>
          <div style={{fontSize:'0.9vw'}}>{userStory?.userName}</div>
        </div>
      ))}  
    </div>
  )
};

export default GetAllUserStoryDistinct;
