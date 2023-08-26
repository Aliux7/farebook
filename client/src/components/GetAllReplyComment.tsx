import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { formatDistanceToNow } from 'date-fns';
import { getUser } from "./GetUser";

const LOAD_REPLAY = gql`
    query GetAllReplayCommentByComment($id:ID!){
        getAllReplayCommentByComment(id:$id){
        id
        commentID
        userID
        userName
        content
        createDate
        }
    }
`;

const CREATE_REPLAY = gql`
    mutation CreateReplayComment($inputReplayComment:NewReplayComment!){
        createReplayComment(inputReplayComment:$inputReplayComment){
        id
        commentID
        userID
        userName
        content
        createDate
        }
    }
`;

interface ReplayComment {
  id: string;
  commentID: string;
  userID: string;
  userName: string;
  content: string;
  createDate: string;
}

function GetAllReplyComment({ commentId, replayInput }) {
    const { error, loading, data, refetch } = useQuery(LOAD_REPLAY, {
        variables: {
            id: commentId // Use the correct prop name
        },
    });
    

  const [replayComments, setReplayComments] = useState<ReplayComment[]>([]);
  const [createReplayComment] = useMutation(CREATE_REPLAY);
  const user = getUser();
  console.log(user?.getUserByToken)

  const handleCreateReplayComment = async (content) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    try {
        const inputReplayComment = { // Use inputReplayComment
            commentID: commentId, // Use commentId
            userID: user?.getUserByToken.id,
            userName: user?.getUserByToken.firstName + " " + user?.getUserByToken.surName,
            content: content,
            createDate: formattedDate,
        };

        await createReplayComment({
            variables: {
                inputReplayComment: inputReplayComment, // Use inputReplayComment
            },
        });

        refetch();
    } catch (error) {
        console.error("Error creating replay comment:", error);
    }
};

  const handleSubmitReplayComment = (e) => {
    e.preventDefault();
    const inputElement = e.target.elements.commentInput;
    const content = inputElement.value.trim();

    if (content) {
      handleCreateReplayComment(content);
      inputElement.value = "";
    }
  };

    useEffect(() => {
        if (data) {
            setReplayComments(data.getAllReplayCommentByComment); // Use the correct field name
        }
    }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log({error, loading, data})

  return (
    <div className="commentSection">
      <div className="commentList">
        {replayComments.map((replayComment) => (
          <div key={replayComment.id} className="commentReplayContainer">
            <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" className="profileImage" />
            <div className="commentInfo">
              <div className="commentContent">
                <p className="userName">{replayComment.userName}</p>
                <p className="content" style={{padding:'10px 0px 5px 0px'}}>{replayComment.content}</p>
              </div>
              <div style={{display: 'flex'}}>
                <p className="timeAgo">{formatDistanceToNow(new Date(replayComment.createDate))} ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {replayInput && (
        <div className="createReplayCommentContainer">
          <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" className="profileImage" />
          <form onSubmit={handleSubmitReplayComment}>
            <input type="text" name="commentInput" />
            <button type="submit" style={{display:"none"}}>Post Comment</button>
          </form>
        </div>
      )}
    </div>

  );
};

export default GetAllReplyComment;
