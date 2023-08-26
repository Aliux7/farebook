import React, { useEffect, useState } from "react";
import MiniHeader from "../components/layout/miniHeader";
import Sidebar from "../components/layout/sidebar"; // Import your Sidebar component
import { gql, useMutation, useQuery } from "@apollo/client";
import TextStoryCarousel from "../components/textStoryCarousel";

const GET_POST_BY_USER = gql`
  query GetAllStory($user_id:String!){
    getAllStory(user_id:$user_id){
      id
      userID
      userName
      dateStory
      imageStory
      textStory
      fontStory
      backgroundStory
      privacy
    }
  }
`;

interface UserStory {
  id: string;
  userID: string;
  userName: string;
  dateStory: string;
  imageStory: boolean;
  textStory: string;
  fontStory: string;
  backgroundStory: string;
  privacy: string;
}

const Story = () => {
  const [selectedUserStory, setSelectedUserStory] = useState("");
  const [storySelected, setStorySelected] = useState<UserStory[]>([]);
  
  const {data} = useQuery(GET_POST_BY_USER, {
    variables: {
      user_id: selectedUserStory,
    },
  })
  useEffect(() => {
    if (data) {
      setStorySelected(data.getAllStory);
    }
  }, [data])
  console.log(storySelected);
  console.log(storySelected.length);



  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar openEditStoryUI="" editTextStory="" editBackgroundStory="" editFontStory="" imageStory="" selectedFile="" previewImageStoryUI="" editSelectedID={setSelectedUserStory}/>

      <div style={{ flex: 1, marginLeft: '23.5%' }}>
        <MiniHeader />
        {!selectedUserStory && (
          <div style={{justifyContent:'center', textAlign:'center', width:'max-content'}}>
            <i className="material-icons" style={{fontSize:'70px', color:'var(--body_color)'}}>photo_library</i>
            <h1>Select a story to open</h1>
          </div>
        )}
        {selectedUserStory && storySelected && (
          <div style={{}}>
            <TextStoryCarousel storySelected={storySelected}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Story;
