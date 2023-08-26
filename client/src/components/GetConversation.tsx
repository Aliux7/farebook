import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import LoadingIndicator from "./loadingIndicator";
import UserObjectList from "./UserObjectList";

const GET_CONVERSATION = gql`
  query GetConversationMessageByChat($userID1: String!, $userID2: String!) {
    getConversationMessageByChat(userID1: $userID1, userID2: $userID2) {
      id
      chatID
      sender
      content
      timestamp
    }
  }
`;

const GET_GROUP_CONVERSATION = gql`
  query GetAllGroupMessageByChatID($chatID: String!){
    getAllGroupMessageByChatID(ChatID:$chatID){
      id
      ChatID
      Sender
      Content
      Timestamp
    }
  }
`;

const GetConversation = ({ userID, friendID, chatID }) => {

  console.log(userID)
  console.log(friendID)
  console.log(chatID)
  const { data: conversationData, loading: conversationLoading, refetch: refetchConversation } = useQuery(GET_CONVERSATION, {
    variables: {
      userID1: userID,
      userID2: friendID,
    }
  });

  
  const { data: conversationGroupData, loading: conversationGroupLoading, refetch: refetchGroupConversation } = useQuery(GET_GROUP_CONVERSATION, {
    variables: {
      chatID: chatID,
    }
  });

  console.log(conversationData)
  console.log(conversationGroupData)
  const [webSocket, setWebSocket] = useState<any>(null); 

  useEffect(() => {
    // Create and initialize the WebSocket connection
    const ws = new WebSocket('ws://localhost:7778/websocket');

    ws.onopen = () => {
        console.log('WebSocket connection opened');
    };

    ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        // Handle the received message
        console.log('Received message:', message);
        
        await Promise.all([refetchGroupConversation(), refetchConversation()]);
      // console.log(conversationData)
      // console.log(conversationGroupData)
    }
    ;

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    setWebSocket(ws);

    // Cleanup WebSocket on component unmount
    return () => {
        if (ws) {
            ws.close();
        }
    };
}, []);

if (conversationLoading) return <LoadingIndicator loading={conversationLoading} />;
if (conversationGroupLoading) return <LoadingIndicator loading={conversationGroupLoading} />;

if(chatID === ""){
  return (
    <div style={{fontSize:'1.5vw'}}>
      {conversationData.getConversationMessageByChat.map((message, index) => {
        const currentSender = message.sender;
        const shouldShowUserObjectList = currentSender === friendID && (index === 0 || conversationData.getConversationMessageByChat[index - 1].sender !== friendID);

        return (
          <div key={message.id}>
            <div>
              {currentSender === userID && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      maxWidth: '70%',
                      margin: '20px',
                    }}
                  >
                  {message.content.startsWith("https://res.cloudinary.com") ? (
                    message.content.endsWith(".webm") ? (
                      <audio controls>
                        <source src={message.content} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <img src={message.content} alt="Image" style={{ maxWidth: '100%' }} />
                    )
                  ) : (
                    message.content
                  )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'gray',margin: '-10px 23px 0px 0px', }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
              {currentSender !== userID && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {shouldShowUserObjectList ? (
                    <div>
                        <UserObjectList userID={friendID} role="" search=""/>
                        <div
                            style={{
                            backgroundColor: '#686868',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            width:'max-content',
                            margin: '-20px 0px 0px 80px',
                            }}
                        >
                        {message.content.startsWith("https://res.cloudinary.com") ? (
                          message.content.endsWith(".webm") ? (
                            <audio controls>
                              <source src={message.content} type="audio/webm" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            <img src={message.content} alt="Image" style={{ maxWidth: '100%' }} />
                          )
                        ) : (
                          message.content
                        )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'gray',margin: '5px 0px 0px 80px', }}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  ) : (
                    <div>
                        <div
                            style={{
                            backgroundColor: '#686868',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            width:'max-content',
                            margin: '10px 0px 0px 80px',
                            }}
                        >
                          {message.content.startsWith("https://res.cloudinary.com") ? (
                            message.content.endsWith(".webm") ? (
                              <audio controls>
                                <source src={message.content} type="audio/webm" />
                                Your browser does not support the audio element.
                              </audio>
                            ) : (
                              <img src={message.content} alt="Image" style={{ maxWidth: '100%' }} />
                            )
                          ) : (
                            message.content
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'gray',margin: '5px 0px 0px 80px', }}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  )
                  }
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
if(chatID != ""){
  return (
    <div>
      {conversationGroupData?.getAllGroupMessageByChatID?.map((message, index) => {
        const currentSender = message.Sender;
        const shouldShowUserObjectList = currentSender === friendID && (index === 0 || conversationData.getAllGroupMessageByChatID[index - 1].Sender !== friendID);

        console.log(userID)
        console.log(currentSender)
      
        return (
          <div key={message.id}>
            <div>
              {currentSender === userID && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      maxWidth: '70%',
                      margin: '20px',
                    }}
                  >
                      {message.Content.startsWith("https://res.cloudinary.com") ? (
                        message.Content.endsWith(".webm") ? (
                          <audio controls>
                            <source src={message.Content} type="audio/webm" />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <img src={message.Content} alt="Image" style={{ maxWidth: '100%' }} />
                        )
                      ) : (
                        message.Content
                      )}

                  </div>
                  <div style={{ fontSize: '12px', color: 'gray',margin: '-10px 23px 0px 0px', }}>
                      {new Date(message.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
              {currentSender !== userID && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {shouldShowUserObjectList ? (
                    <div>
                        <UserObjectList userID={friendID} role="" search=""/>
                        <div
                            style={{
                            backgroundColor: '#686868',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            width:'max-content',
                            margin: '-20px 0px 0px 80px',
                            }}
                        >
                        {message.Content.startsWith("https://res.cloudinary.com") ? (
                          message.Content.endsWith(".webm") ? (
                            <audio controls>
                              <source src={message.Content} type="audio/webm" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            <img src={message.Content} alt="Image" style={{ maxWidth: '100%' }} />
                          )
                        ) : (
                          message.Content
                        )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'gray',margin: '5px 0px 0px 80px', }}>
                            {new Date(message.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  ) : (
                    <div>
                        <div
                            style={{
                            backgroundColor: '#686868',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            width:'max-content',
                            margin: '10px 0px 0px 80px',
                            }}
                        >
                        {message.Content.startsWith("https://res.cloudinary.com") ? (
                          message.Content.endsWith(".webm") ? (
                            <audio controls>
                              <source src={message.Content} type="audio/webm" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            <img src={message.Content} alt="Image" style={{ maxWidth: '100%' }} />
                          )
                        ) : (
                          message.Content
                        )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'gray',margin: '5px 0px 0px 80px', }}>
                            {new Date(message.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  )
                  }
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
};

export default GetConversation;
