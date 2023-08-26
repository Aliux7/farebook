import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../styles/Group.css"
import GetAllGroupPosts from "../components/GetAllGroupPosts";
import { getUser } from "../components/GetUser";
import LoadingIndicator from "../components/loadingIndicator";

const GET_JOINED_GROUP = gql`
  query GetJoinedGroups($userID:String!){
    getJoinedGroups(userID:$userID){
      id
      Name
      Privacy
    }
  }
`;

const Group = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [passValueSearch, setPassValueSearch] = useState("")
  const [search, setSearch] = useState("");
  const {data, loading, error} = useQuery(GET_JOINED_GROUP, {
    variables:{
      userID: user?.getUserByToken?.id
    }
  })

  if(!user) return
  if(loading) return <LoadingIndicator loading={loading}/>

  const handleSubmitSearch = (e) => {
    e.preventDefault(); 
    console.log(search)
    console.log(user)
    setPassValueSearch(search)
  }

  console.log(data?.getJoinedGroups);
  return (
    <div style={{width:'100vw', minHeight:'100vh', position:'relative', display:'flex'}} className="group-page">
      <div className="sidebar group-sidebar" style={{position:'sticky', top:'0px', left:'0px', height:'100vh', width:'25vw'}}>
        <div style={{marginTop:'80px', marginLeft:'20px'}}>
          <h1>Group</h1>
          <form onSubmit={handleSubmitSearch}>
            <input type="text" name="search" id="search" placeholder="Search Facebook" onChange={(e) => setSearch(e.target.value)} className="search-group" style={{width:'20vw'}}/>
            <i className="fas fa-magnifying-glass search-loop"></i>
            <button type="submit" style={{display:"none"}}></button>
          </form>
          <div className="sidebar-group-item">
            <div>Your feed</div>
            <div>Discover</div>
            <div>Your groups</div>
            <div onClick={() => navigate('/group/create')}>+ Create new group</div>
          </div>
          <div style={{marginTop:'10px'}}>
            <h1 style={{fontSize:'1.5vw'}}>Groups you've joined</h1>
            {data?.getJoinedGroups?.map((group) => (
              <div style={{margin:'1vw'}}>{group.Name}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="group-preview-container">
        <GetAllGroupPosts search={passValueSearch} user={user} testing={search}/>
      </div>
    </div>
  );
};

export default Group
