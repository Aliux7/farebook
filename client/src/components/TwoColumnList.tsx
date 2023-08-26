import React, { useState } from 'react';
import '../styles/TwoColumnList.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { getUser } from './GetUser';
import FriendObjectList from './FriendObjectList ';
import UserObjectList from './UserObjectList';

const INVITE_FRIEND = gql`
    mutation CreatePendingMember($inputPendingMember: NewPendingGroupMember!){
        createPendingMember(inputPendingMember: $inputPendingMember){
        id
        GroupID
        UserID
    }  
    }
`;


const GET_ALL_FRIENDS = gql`
  query GetAllFriends($id: ID!) {
    getAllFriends(id: $id) {
      id
      userID
      friendID
      status
      createDate
    }
  }
`;

const TwoColumnList = ({groupID, setInvite}) => {
  const user = getUser();
  const [inviteFriend] = useMutation(INVITE_FRIEND);
  const { data: allFriendsData, loading: friendsLoading } = useQuery(GET_ALL_FRIENDS, {
    variables: {
      id: user?.getUserByToken?.id,
    },
  });

  const leftItems = allFriendsData?.getAllFriends || [];
  const [selectedLeftIndices, setSelectedLeftIndices] = useState<number[]>([]);
  const [rightItems, setRightItems] = useState<any[]>([]);

  const moveToRight = (index: number) => {
    const itemToMove = leftItems[index];

    // Check if the item is not already in the rightItems array
    if (!rightItems.includes(itemToMove)) {
      setSelectedLeftIndices((prevIndices) => prevIndices.filter((i) => i !== index));
      setRightItems([...rightItems, itemToMove]);
    }
  };

  const moveToLeft = (index: number) => {
    setSelectedLeftIndices([...selectedLeftIndices, index]);
    const itemToMove = rightItems[index];
    setRightItems(rightItems.filter((_, i) => i !== index));
  };

  const handleInvite = async () => {
    for (const item of rightItems) {
        try {
          await inviteFriend({
            variables: {
              inputPendingMember: {
                GroupID: groupID,
                UserID: item.friendID,
              },
            },
          });
          console.log(`Invitation sent to friend with ID: ${item.friendID}`);
        } catch (error) {
          console.error(`Error sending invitation to friend with ID: ${item.friendID}`);
        }
    }
    setInvite(false);
  }

  return (
    <div>
        <div className="two-column-list-container">
            <div className="left-column">
                <h2>Friends</h2>
                <ul style={{maxHeight:'50vh', overflowY:'scroll'}}>
                {leftItems.map((item, index) => (
                    <li
                    key={index}
                    onClick={() => moveToRight(index)}
                    className={selectedLeftIndices.includes(index) ? 'selected' : ''}
                    >
                        <UserObjectList userID={item.friendID} role="" search=""/>
                    </li>
                ))}
                </ul>
            </div>
            <div className="right-column">
                <h2>Selected</h2>
                <ul style={{maxHeight:'50vh', overflowY:'scroll'}}>
                {rightItems.map((item, index) => (
                    <li key={index} onClick={() => moveToLeft(index)}>
                        <UserObjectList userID={item.friendID} role="" search=""/>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        <div style={{width:'100%', backgroundColor:'#336db4', display:'flex', justifyContent:'center', alignItems:'center', padding:'0.7vw', borderRadius:'10px', margin:'1vw 0vw', cursor:'pointer'}} onClick={handleInvite}>Invite</div>
    </div>
  );
};

export default TwoColumnList;
