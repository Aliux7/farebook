import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { getUser } from "../../src/components/GetUser";
import LoadingIndicator from '../components/loadingIndicator';
import UserObjectList from '../components/UserObjectList';
import GetConversation from '../components/GetConversation';
import "../styles/Messenger.css"
import GroupMemberObjectList from '../components/GroupMemberObjectList';
import Axios from 'axios';
import RecordRTC from 'recordrtc';
import { AiFillCloseCircle, AiFillFileImage, AiFillPauseCircle, AiFillPlayCircle, AiOutlineSend } from 'react-icons/ai'
import MicIcon from '@mui/icons-material/Mic';
import { MdKeyboardVoice } from 'react-icons/md'


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

const GET_ALL_FRIENDS = gql`
  query GetAllFriends($id: ID!){
    getAllFriends(id:$id){
      id
      userID
      friendID
      status
      createDate
    }
  }
`;

const GET_ALL_CHAT = gql`
  query GetAllUserChat($userID: String!){
    getAllUserChat(userID:$userID)
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($inputChat: NewChat!){
    createChat(inputChat:$inputChat){
      id
      userID1
      userID2
      createdAt
    }
  }
`;

const GET_CHAT = gql`
  query GetChoosenChat($userID1: String!, $userID2:String!){
    getChoosenChat(userID1:$userID1, userID2:$userID2)
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($inputMessage:NewMessage!){
    createMessage(inputMessage:$inputMessage){
      id
      chatID
      sender
      content
      timestamp
    }
  }
`;

const GET_ALL_GROUP_CHAT = gql`
  query GetAllGroupChatByUserID($userID: String!){
    getAllGroupChatByUserID(UserID:$userID){
      id
      ChatID
      UserID
      CreatedAt
    }
  }
`;

const CREATE_GROUP_CHAT = gql`
  mutation CreateGroupChat{
    createGroupChat{
      id
      CreatedAt
    }
  }
`;


const CREATE_MEMBER_GROUP = gql`
  mutation CreateGroupChatMember($inputGroupChatMember: NewGroupChatMember!){
    createGroupChatMember(inputGroupChatMember: $inputGroupChatMember){
      id
      ChatID
      UserID
      CreatedAt
    }
  }
`;

const CREATE_GROUP_CHAT_MESSAGE = gql`
  mutation CreateGroupChatMessage($inputGroupChatMessage:NewGroupChatMessage!){
    createGroupChatMessage(inputGroupChatMessage:$inputGroupChatMessage){
      id
      ChatID
      Sender
      Content
      Timestamp
    }
  }
`;

interface Option {
  value: string;
  label: string;
}

interface SearchDropdownProps {
  options: Option[];
}

const Messenger = () => {
  const user = getUser();
  const [search, setSearch] = useState("");
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  
  const {data: allChatData, loading: chatLoading, refetch: refetchChat} = useQuery(GET_ALL_CHAT, {
    variables: {
      userID: user?.getUserByToken?.id,
    },
  }) 

  const {data: allGroupChatData, loading: GroupChatLoading, refetch: refetchGroupChat} = useQuery(GET_ALL_GROUP_CHAT, {
    variables: {
      userID: user?.getUserByToken?.id,
    },
  }) 

  const {data: allFriendsData, loading: friendsLoading} = useQuery(GET_ALL_FRIENDS, {
    variables: {
      id: user?.getUserByToken?.id,
    },
  }) 

  const [createChat] = useMutation(CREATE_CHAT);
  const [createGroup] = useMutation(CREATE_GROUP_CHAT);
  const [addGroupMember] = useMutation(CREATE_MEMBER_GROUP);
  const [isOpenCreateChat, setIsOpenCreateChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  useEffect(() => {
    if (!friendsLoading && allFriendsData?.getAllFriends.length > 0) {
      const friendOptions: Option[] = allFriendsData?.getAllFriends.map((friend: any) => ({
        value: friend.friendID,
        label: friend.friendID,
      }));
      setOptions(friendOptions);
    }
  }, [allFriendsData, friendsLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchQuery, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchQuery('');
  };

  const handleOptionClick = (value: string) => {
    console.log('Selected:', selectedOptions);
    setSelectedOptions(prevSelected => [...prevSelected, value]);
    toggleDropdown();
  };
  
  const handleCreateChat = () => {
    if(selectedOptions.length === 1){
     createChat({
      variables: {
        inputChat: {
          userID1: user?.getUserByToken?.id,
          userID2: selectedOptions[0],
        },
      },
     }).then(() => {
        refetchChat();
        refetchGroupChat();
        setIsOpenCreateChat(false);
     })
    }else if(selectedOptions.length > 1){
      createGroup().then((result) => {
        console.log(result.data.createGroupChat.id);
        selectedOptions.map((option) => {
          addGroupMember({
            variables: {
              inputGroupChatMember: {
                ChatID: result.data.createGroupChat.id,
                UserID: option,
              },
            },
          })
        })
        addGroupMember({
          variables: {
            inputGroupChatMember: {
              ChatID: result.data.createGroupChat.id,
              UserID: user?.getUserByToken?.id,
            },
          },
        }).then(() => {
          refetchChat();
          refetchGroupChat();
          setIsOpenCreateChat(false);
        })
      })
    }
  }

  const groupedData = {};
  allGroupChatData?.getAllGroupChatByUserID.forEach(member => {
    if (!groupedData[member.ChatID]) {
      groupedData[member.ChatID] = [];
    }
    groupedData[member.ChatID].push(member.UserID);
  });
  console.log(allGroupChatData?.getAllGroupChatByUserID)
  console.log(groupedData)

  const formData = new FormData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file.name);
    setSelectedFile(file);
  };



  const [openChat, setOpenChat] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [content, setContent] = useState("");
  const [sendMessage] = useMutation(CREATE_MESSAGE);
  const [sendGroupMessage] = useMutation(CREATE_GROUP_CHAT_MESSAGE);
  

  const {data: chatIdData, loading: chatIDLoading} = useQuery(GET_CHAT, {
    variables: {
      userID1: user?.getUserByToken?.id,
      userID2: selectedFriend
    },
  }) 

  

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<any>(null);
  const [audioBlob, setAudioBlob] = useState<any>(null);
  const [audioURL, setAudioURL] = useState<any>(null);



  if(friendsLoading) return <LoadingIndicator loading={friendsLoading}/>
  if(chatIDLoading) return <LoadingIndicator loading={chatIDLoading}/>
  if(chatLoading) return <LoadingIndicator loading={chatLoading}/>
  if(GroupChatLoading) return <LoadingIndicator loading={GroupChatLoading}/>
  // console.log(allFriendsData?.getAllFriends);
  // const { data: queryData } = useQuery(GET_CONVERSATION, {
  //   pollInterval: 1000, // Fetch data every 200 ms
  // });

  console.log(user?.getUserByToken?.id);
  console.log(selectedFriend);
  console.log(chatIdData?.getChoosenChat);

  const handleSubmit = (e: React.FormEvent) => {
    console.log(content);
    e.preventDefault();

    createNotification({
      variables: {
        inputNotification:{
          userID: selectedFriend,
          content: "You have 1 message from " + user?.getUserByToken?.firstName,
          createDate: "",
          status: "unread",
        }
      }
    })

    console.log(audioBlob)
    console.log(selectedFile)
    console.log(content)

    if(audioBlob){
      formData.append("file", audioBlob);
      formData.append("upload_preset", "pav17yz2");
      let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/upload';
      
      Axios.post(
        apiUrl,
        formData
      ).then((response) => {
        if(selectedFriend !== ""){
          sendMessage({
            variables: { 
              inputMessage: { 
                chatID: chatIdData?.getChoosenChat,
                sender: user?.getUserByToken?.id,
                content: response.data.secure_url,  
            } },
          });
        }else{
          sendGroupMessage({
            variables: { 
              inputGroupChatMessage: { 
                ChatID: selectedGroup,
                Sender: user?.getUserByToken?.id,
                Content: response.data.secure_url,  
            }},
          })
        }
        setAudioBlob(null)
      });
  }else if(selectedFile){
      formData.append("file", selectedFile);
      formData.append("upload_preset", "pav17yz2");
      
      let apiUrl = 'https://api.cloudinary.com/v1_1/dz7mnls0q/';
      if (selectedFile.type.includes('image')) {
        apiUrl += 'image/upload';
      } else {
        console.log(`Unsupported file type: ${selectedFile.type}`);
      }

      Axios.post(
        apiUrl,
        formData
      ).then((response) => {
        if(selectedFriend !== ""){
          sendMessage({
            variables: { 
              inputMessage: { 
                chatID: chatIdData?.getChoosenChat,
                sender: user?.getUserByToken?.id,
                content: response.data.secure_url,  
            } },
          });
        }else{
          sendGroupMessage({
            variables: { 
              inputGroupChatMessage: { 
                ChatID: selectedGroup,
                Sender: user?.getUserByToken?.id,
                Content: response.data.secure_url,  
            }},
          })
        }
        setSelectedFile(null)
      });
    }else if (content.trim() !== "") {
      console.log("MASUK");
      if(selectedFriend !== ""){
        sendMessage({
          variables: { 
            inputMessage: { 
              chatID: chatIdData?.getChoosenChat,
              sender: user?.getUserByToken?.id,
              content: content,  
          } },
        });
      }else{
        sendGroupMessage({
          variables: { 
            inputGroupChatMessage: { 
              ChatID: selectedGroup,
              Sender: user?.getUserByToken?.id,
              Content: content,  
          }},
        })
      }
      setContent('');
    }
  };

  const userOnClick = (friendID) => {
    setSelectedFriend(friendID);
    setSelectedGroup("");
    setSelectedFile(null);
    setOpenChat(true);
  }

  const groupOnClick = (chatID) => {
    setSelectedGroup(chatID);
    setSelectedFriend("");
    setSelectedFile(null);
    setOpenChat(true);
  }

  const startRecording = async () => {
    if(!isRecording){
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioRecorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
        });
    
        audioRecorder.startRecording();
        setAudioRecorder(audioRecorder);
        setIsRecording(true);
    }else{
        stopRecording()
    }
  };

  const pauseRecording = () => {
    setIsPaused(true);
    audioRecorder.pauseRecording();
    };

    const resumeRecording = () => {
        setIsPaused(false);
        audioRecorder.resumeRecording();
    };

  const stopRecording = async () => {
    if (audioRecorder) {
        audioRecorder.stopRecording(() => {
        const audioBlob = audioRecorder.getBlob();
        setAudioBlob(audioBlob)
        setAudioURL(URL.createObjectURL(audioBlob));

        setIsRecording(false);
        setAudioRecorder(null);
      });
    }
  };

  return (
    <div style={{width:'100vw', minHeight:'100vh', position:'relative', display:'flex', justifyContent:'flex-end'}}>
      <div className="sidebar responsive-chat-sidebar" style={{position:'sticky', top:'0px', left:'0px', height:'100vh', width:'25vw', borderRight:'1px solid rgba(255, 255, 255, 0.084)'}}>
        <div style={{marginTop:'80px', marginLeft:'20px', marginRight:'20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
            <h2>Chat</h2>
            <i className="fa fa-pencil-square-o" style={{fontSize:'24px', cursor:'pointer'}} onClick={(e) => setIsOpenCreateChat(true)}></i>
          </div>
          <div>
          <input type="text" name="search" id="search" placeholder="Search Chat" className='search-input' style={{width:'85%'}} onChange={(e) => setSearch(e.target.value)}/>
          </div>
          <div style={{margin:"20px 0px"}}>
            {Object.keys(groupedData).map(chatID => (
              <div key={chatID} style={{marginLeft: '10px', cursor:'pointer'}} onClick={(e) => groupOnClick(chatID)}>
                <ul style={{display:'flex', margin:'0px 10px 20px 0px', alignItems:'center'}}>           
                  <img src={user?.getUserByToken?.profilePicture}  style={{width:'3.5vw', borderRadius:'20%', marginRight:'1vw'}} alt="Profile" />
                  {groupedData[chatID].map(userID => (
                    <div key={userID} style={{padding:'0px'}}>
                      <GroupMemberObjectList userID={userID}/>
                    </div>
                  ))}...
                </ul>
              </div>
            ))}
            {allChatData?.getAllUserChat.map((friend) => (
              <div key={friend} style={{cursor:'pointer'}} onClick={(e) => userOnClick(friend)}>
                <UserObjectList userID={friend} role="" search={search}/>
              </div>
            ))}
            {allChatData?.getAllUserChat?.length < 1 && !groupedData && (
              <h2 className='timeAgo'>No Chat</h2>
            )}
          </div>
        </div>
      </div>
      <div className="group-preview-container responsive-chat-conversation" style={{display:'flex', alignItems:'baseline', backgroundColor:'var(--header_background)'}}>
        <div className='responsive-chat-conversation'>
          {openChat && (
            <div>
              {selectedFriend !== "" && (
                <div>
                  <div className='responsive-chat-conversation' style={{backgroundColor:'var(--header_background)', border:'1px solid rgba(255, 255, 255, 0.084)'}}>
                    <UserObjectList userID={selectedFriend} role="" search=""/>
                  </div>
                  <div className='responsive-chat-conversation' style={{height:'73vh', backgroundColor:'var(--header_background)', border:'1px solid rgba(255, 255, 255, 0.084)', overflowY:'scroll'}}>
                    <GetConversation userID={user?.getUserByToken?.id} friendID={selectedFriend} chatID=""/>
                  </div>
                  <div style={{backgroundColor:'var(--header_background)', width:'75vw', height:'8.5vh'}}>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                  {audioBlob && (<audio controls style={{height:'4vh', width:'13vw', marginRight:'15px'}}>
                              <source src={audioURL} type="audio/wav" />
                          </audio>)}
                          <div className='chat-actions'>
                              {audioBlob && <AiFillCloseCircle className='count-icons' onClick={() => {setAudioBlob(null)}}/>}
                          </div>

                    <i className="fa fa-microphone" onClick={startRecording} style={{fontSize:'27px', color: isRecording ? "#007bff" : "grey", margin: "0px 10px", paddingTop: "7px", cursor: "pointer" }}></i>
                    
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*" // Set the accepted file types if needed
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileInput">
                    <i
                      className="fa fa-file-photo-o"
                      style={{ fontSize: "27px", color: selectedFile ? "#007bff" : "grey", margin: "0px 10px", paddingTop: "5px", cursor: "pointer" }}
                    ></i>
                  </label>
                    <form onSubmit={handleSubmit}>
                      <input
                          type="text"
                          className="group-input"
                          placeholder="Aa"
                          style={{width: '50vw'}}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        <button type="submit" hidden>Send</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              {selectedGroup !== "" && (
                <div>
                  <div className='responsive-chat-conversation' style={{backgroundColor:'var(--header_background)', border:'1px solid rgba(255, 255, 255, 0.084)', display:'flex', height:'11vh', alignItems:'center', paddingLeft:'2vw'}}>
                    {groupedData[selectedGroup].map(userID => (
                      <div key={userID} style={{padding:'0px'}}>
                        <GroupMemberObjectList userID={userID}/>
                      </div>
                    ))}...
                  </div>
                  <div className='responsive-chat-conversation' style={{height:'73vh', backgroundColor:'var(--header_background)', border:'1px solid rgba(255, 255, 255, 0.084)', overflowY:'scroll'}}>
                    <GetConversation userID={user?.getUserByToken?.id} friendID="" chatID={selectedGroup}/>
                  </div>
                  <div style={{backgroundColor:'var(--header_background)', width:'75vw', height:'8.5vh'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>

                          {audioBlob && (<audio controls style={{height:'4vh', width:'13vw', marginRight:'15px'}}>
                              <source src={audioURL} type="audio/wav" />
                          </audio>)}
                          <div className='chat-actions'>
                              {audioBlob && <AiFillCloseCircle className='count-icons' onClick={() => {setAudioBlob(null)}}/>}
                          </div>

                    <i className="fa fa-microphone" onClick={startRecording} style={{fontSize:'27px', color: isRecording ? "#007bff" : "grey", margin: "0px 10px", paddingTop: "7px", cursor: "pointer" }}></i>
                    {/* Label element associated with the file input */}
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*" // Set the accepted file types if needed
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput">
                      <i
                        className="fa fa-file-photo-o"
                        style={{ fontSize: "27px", color: selectedFile ? "#007bff" : "grey", margin: "0px 10px", paddingTop: "5px", cursor: "pointer" }}
                      ></i>
                    </label>
                      <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="group-input"
                            placeholder="Aa"
                            style={{width: '50vw'}}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          />
                          <button type="submit" hidden>Send</button>
                        </form>
                      </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isOpenCreateChat && (
        <div className='overlay' onClick={(e) => {setIsOpenCreateChat(false), setSelectedOptions(([]))}}>
          <div style={{width:'30vw', height:'60vh', backgroundColor:'var(--header_background)', borderRadius:'10px', display:'flex', alignItems:'center',flexDirection:'column'}} onClick={(e) => e.stopPropagation()}>
            <div className={`search-dropdown ${isOpen ? 'open' : ''}`}>
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={toggleDropdown}
                  ref={inputRef}
                />
              </div>
              {isOpen && (
                <ul className="options-list">
                  {filteredOptions.map(option => (
                    <li
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                    >
                      <UserObjectList userID={option.label} role="" search=""/>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{width:'97%', height:'80%', display:'flex', justifyContent:'flex-start', flexDirection:"column", padding:'20px'}}>
              <h1 style={{fontSize:'1vw'}}>Selected User</h1>
              <ul className='selected-options-list'>
                {selectedOptions.map(option => (
                  <li
                    key={option}
                    // onClick={() => handleOptionRemove(option)}
                  >
                    <UserObjectList userID={option} role="" search=""/>
                  </li>
                ))}
              </ul>
            </div>
            {selectedOptions.length > 0 && (
              <div onClick={handleCreateChat} style={{width:'97%', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'1vw', backgroundColor: selectedOptions.length > 0 ? "#3c91ff" : "gray", borderRadius:'10px', height:'7%'}}>
                Create Chat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
