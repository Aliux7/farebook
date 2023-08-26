import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { getUser } from "./GetUser";

const GET_GROUP_INFO = gql`
  query GetGroupByID($id: String!) {
    getGroupByID(id: $id) {
      id
      Name
      Privacy
      CreateDate
    }
  }
`;

const CREATE_GROUP_MEMBER = gql`
    mutation CreateGroupMember($inputNewGroupMember: NewGroupMember!){
        createGroupMember(inputGroupMember:$inputNewGroupMember){
        id
        GroupID
        UserID
        Role
        }
    }
`;

const DELETE_REQUEST_GROUP = gql`
    mutation DeletePendingMember($id:ID!){
        deletePendingMember(id:$id){
        id
        GroupID
        UserID
        }
    }
`;

const GroupInfo = ({ groupID, id, groupPendingRefetch }) => {
  const user = getUser();
  const [createGroupMember] = useMutation(CREATE_GROUP_MEMBER);
  const [deleteGroupMember] = useMutation(DELETE_REQUEST_GROUP);
  const { data, loading, error } = useQuery(GET_GROUP_INFO, {
    variables: { id: groupID },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleJoin = () => {
    const inputNewGroupMember = {
        GroupID: groupID,
        UserID: user?.getUserByToken?.id,
        Role: "Member"
    }

    createGroupMember({
        variables: {
            inputNewGroupMember: inputNewGroupMember
        }
    })

    deleteGroupMember({
        variables: {
            id: id
        }
    })
    groupPendingRefetch()
  }

  
  const handleDelete = () => {
    deleteGroupMember({
        variables: {
            id: id
        }
    })
    groupPendingRefetch()
  }
  const group = data?.getGroupByID;
  console.log(group);

  return (
    <div>
        <div style={{display:'flex', flexDirection:'column'}}>
            <div>
              <p>{group.Name} invited you to join</p>
            </div>
            <div style={{display:'flex'}}>
                <div style={{margin:'0.5vw', color:'#3c91ff'}} onClick={handleJoin}>Join</div>
                <div style={{margin:'0.5vw'}} onClick={handleDelete}>Delete</div>
            </div>
        </div>
    </div>
  );
};

export default GroupInfo;
