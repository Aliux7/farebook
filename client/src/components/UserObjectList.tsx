import { gql, useQuery } from "@apollo/client";
import React from "react";
import LoadingIndicator from "./loadingIndicator";
import { getUser } from "./GetUser";

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

const UserObjectList = ({userID, role, search}) => {
  const {data, loading, error} = useQuery(GET_USER, {
    variables: {
      id: userID
    }
  })

  if(loading) return <LoadingIndicator loading={loading}/>
  console.log(userID, loading)
  console.log(data, loading)

  const startsWithSearch = data?.getUser?.firstName.toLowerCase().startsWith(search.toLowerCase());
  return (
    <div>
      {startsWithSearch && (
        <div key={data.getUser.id} className="user-item">
          <div style={{display: 'flex', alignItems:'center', fontSize:'1vw'}}>
              <img src={data.getUser.profilePicture} alt="Profile" style={{width:'3.5vw', height:'3.5vw'}}/>
              <p>{data.getUser.firstName + " " + data.getUser.surName}</p>
              <div className="timeAgo">{role}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserObjectList;
