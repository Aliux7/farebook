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

const GroupMemberObjectList = ({userID}) => {
  const {data, loading, error} = useQuery(GET_USER, {
    variables: {
      id: userID
    }
  })

  if(loading) return <LoadingIndicator loading={loading}/>
  return (
    <div key={data.getUser.id}>
        <div style={{width:'max-content', fontSize:'1vw'}}>
            <p>{data.getUser.firstName + ","}</p>
        </div>
    </div>
  );
};

export default GroupMemberObjectList;
