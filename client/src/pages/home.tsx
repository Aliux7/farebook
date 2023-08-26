import React from "react";
import GetAllPosts from "../components/GetAllPosts";
import { getUser } from "../components/GetUser";
import LoadingIndicator from "../components/loadingIndicator";
import UserObjectList from "../components/UserObjectList";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = getUser();
  const navigate = useNavigate();
  if(!user) return <div>Loading...</div>
  console.log(user?.getUserByToken);
  return ( 
    <div style={{marginTop: '70px', display:'flex'}} className="home-content">
      <div style={{marginTop: '10px'}} className="leftbar-hide">
        <ul style={{textDecoration:'none', listStyle:'none'}}>
          <li style={{display:'flex', alignItems:'center', margin:'10px 0px', cursor:'pointer'}} onClick={(e) => navigate('/profile', { state: { value: { id: user?.getUserByToken?.id } } })}>
            <img style={{width:"40px", borderRadius:'50%'}} src={user?.getUserByToken?.profilePicture}/>
            <span style={{marginLeft:'10px'}}>{user?.getUserByToken?.firstName + " " + user?.getUserByToken?.surName}</span>
          </li>
          <li style={{display:'flex', alignItems:'center', margin:'10px 0px', cursor:'pointer'}} onClick={(e) => navigate('/friend')}>
            <svg style={{marginRight:'10px'}} width="40" height="40" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8 7.2a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Zm9.6 0a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Zm-4.884 13.2a8.6 8.6 0 0 0 .084-1.2 8.364 8.364 0 0 0-1.8-5.196 6 6 0 0 1 9 5.196v1.2h-7.284ZM7.2 13.2a6 6 0 0 1 6 6v1.2h-12v-1.2a6 6 0 0 1 6-6Z"></path>
            </svg>
            <p>Friends</p>
          </li>
          <li style={{display:'flex', alignItems:'center', margin:'10px 0px', cursor:'pointer'}} onClick={(e) => navigate('/group')}>
            <svg style={{marginRight:'10px'}} width="40" height="40" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.6 7.2a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Zm6 2.4a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0ZM16.8 18a4.8 4.8 0 1 0-9.6 0v3.6h9.6V18ZM7.2 9.6a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0Zm12 12V18a7.166 7.166 0 0 0-.9-3.487A3.606 3.606 0 0 1 22.8 18v3.6h-3.6ZM5.7 14.513A7.167 7.167 0 0 0 4.8 18v3.6H1.2V18a3.6 3.6 0 0 1 4.5-3.487Z"></path>
            </svg>
            <p>Groups</p>
          </li>
          <li style={{display:'flex', alignItems:'center', margin:'10px 0px', cursor:'pointer'}} onClick={(e) => navigate('/story')}>
            <svg style={{marginRight:'10px'}} width="40" height="40" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path>
            </svg>
            Story
          </li>
        </ul>
      </div>
      <div>
        <GetAllPosts search=""/>
      </div>
      <div className="rightbar-hide" style={{marginTop:'10px', width:'250px', height:'80vh', backgroundColor:'var(--header_background)', borderRadius:'10px'}}>
        
      </div>
    </div>
  )
  
};

export default Home;
