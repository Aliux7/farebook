import { gql, useQuery } from "@apollo/client";
import React from "react";
import LoadingIndicator from "./loadingIndicator";

const GET_USER = gql`
    query GetUser($id:ID!){
        getUser(id:$id){
            id
            profilePicture
            firstName
            surName
            email
            password
            dob
            gender
        }
    }
`;

const FriendObjectList = ({userID}) => {
  const {data, loading, error} = useQuery(GET_USER, {
    variables: {
      id: userID
    }
  })

  if(loading) return <LoadingIndicator loading={loading}/>
  console.log(userID, loading)
  console.log(data, loading)

  return (
    <div>
      <div key={data.getUser.id} className="user-item" style={{width:'35vw'}}>
        <div style={{display: 'flex', alignItems:'center', fontSize:'1vw'}}>
            <img src={data.getUser.profilePicture} alt="Profile" style={{width:'4.5vw', height:'4.5vw'}}/>
            <p style={{fontSize:'1.3vw'}}>{data.getUser.firstName + " " + data.getUser.surName}</p>
        </div>
      </div>
    </div>
  );
};

export default FriendObjectList;
