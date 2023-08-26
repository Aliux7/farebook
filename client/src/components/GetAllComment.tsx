import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { formatDistanceToNow } from 'date-fns';
import { getUser } from "./GetUser";
import GetAllReplyComment from "./GetAllReplyComment";

const LOAD_COMMENT = gql`
   query GetAllCommentByPost($id:ID!){
        getAllCommentByPost(id:$id){
            id
            postID
            userID
            userName
            content
            createDate
        }
    }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($inputComment:NewComment!){
    createComment(inputComment: $inputComment){
      id
      postID
      userID
      userName
      content
      createDate
    }
  }
`;

const CREATE_LIKE = gql`
  mutation CreateLikeComment($inputCommentLike:NewLikeComment!){
    createLikeComment(inputCommentLike:$inputCommentLike){
      id
      commentID
      userID
      userName
      createDate
    }
  }
`;

const DELETE_LIKE = gql`
  mutation DeleteLikeComment($commentID:String!, $userID:String!){
    deleteLikeComment(commentID:$commentID, userID:$userID){
      id
      commentID
      userID
      userName
      createDate
    }
  }
`;

const CHECK_LIKE = gql`
  query CheckLikeCommentByComment($commentID:String!, $userID:String!){
    checkLikeCommentByComment(commentID: $commentID, userID: $userID)
  }
`;

const COUNT_LIKE = gql`
  query CountAllLikeCommentByComment($id:ID!){
    countAllLikeCommentByComment(id:$id)
  }
`;

interface Comment {
  id: string;
  postID: string;
  userID: string;
  userName: string;
  content: string;
  createDate: string;
}

function GetAllComment() {
    const { error, loading, data, refetch } = useQuery(LOAD_COMMENT, {
        variables: {
        id: localStorage.getItem("openPostId")
        },
    });

  const [showInputReplay, setShowInputReplay] = useState(false);
  const handleShowInputReplay = () => {
    setShowInputReplay(!showInputReplay);
  }

  const apolloClient = useApolloClient();
  const [likeStates, setLikeStates] = useState(Array.from({ length: 100 }, () => false));
  const [comments, setComments] = useState<Comment[]>([]);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [createLike] = useMutation(CREATE_LIKE);
  const [deleteLike] = useMutation(DELETE_LIKE);
  const user = getUser();
  console.log(user?.getUserByToken)

  console.log(data);
  useEffect(() => {
    const checkLikes = async () => {
      try {
        const userID = user?.getUserByToken.id;
  
        const newLikeStates = await Promise.all(data.getAllCommentByPost.map(async (item) => {
          const commentID = item.id;
  
          console.log(commentID);
          console.log(userID);
  
          const { data: dataCountLike } = await apolloClient.query({
            query: CHECK_LIKE,
            variables: { commentID, userID },
          });
  
          console.log(`[${commentID}] After query, Result:`, dataCountLike.checkLikeCommentByComment);
          return dataCountLike.checkLikeCommentByComment;
        }));
  
        console.log("All queries completed:", newLikeStates);
        setLikeStates(newLikeStates);
      } catch (error) {
        console.error("Error checking likes:", error);
      }
    };
  
    checkLikes();
  }, [data, apolloClient, user]);
  
  const [likeCounts, setLikeCounts] = useState({});
  useEffect(() => {
    const countLikes = async () => {
      try {
        console.log("INI COUNTING COMMENT LIKES")
        const newLikeStates = await Promise.all(data.getAllCommentByPost.map(async (item) => {
          const commentID = item.id;
  
          console.log(commentID);
  
          const { data: dataCommentLike } = await apolloClient.query({
            query: COUNT_LIKE,
            variables: { id: commentID },
          });
  
          console.log(`[${commentID}] After query, Result:`, dataCommentLike.countAllLikeCommentByComment);
          return dataCommentLike.countAllLikeCommentByComment;
        }));
  
        console.log("All queries completed:", newLikeStates);
        setLikeCounts(newLikeStates);
      } catch (error) {
        console.error("Error checking likes:", error);
      }
    };
  
    countLikes();
  }, [data, apolloClient, user]);

  console.log(likeCounts)

  const handleCreateComment = async (content) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    try {
      const inputComment = {
        postID: localStorage.getItem("openPostId"),
        userID: user?.getUserByToken.id,
        userName: user?.getUserByToken.firstName + " " + user?.getUserByToken.surName, 
        content: content,
        createDate: formattedDate,
      };
      
      await createComment({
        variables: {
          inputComment: inputComment,
        },
      });
      
      refetch();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const clickLikeButton = async (index, commentId) => {
    const newLikeStates = [...likeStates];
    newLikeStates[index] = !newLikeStates[index];
    setLikeStates(newLikeStates); 
    
    // const postID = items[index].id; 
    const userID = user?.getUserByToken.id;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    const inputCommentLike = {
      commentID: commentId,
      userID: userID,
      userName: user?.getUserByToken.firstName + " " + user?.getUserByToken.surName,
      createDate: formattedDate,
    };
  
    try {
      if (newLikeStates[index]) {
        console.log("INSERT")
        console.log(inputCommentLike)

        createLike({ variables: { inputCommentLike } })
          .then(result => {
          console.log("INSERT DONE");
          console.log(result);
        }).catch(error => {
            console.error("Error inserting:", error);
        });
      } else {
        console.log("DELETE")
        deleteLike({
          variables: { 
            commentID: commentId,
            userID: userID,
           },
        }).then(result => {
          console.log("DELETE DONE")
        }).catch(error => {
            console.error("Error DELETEING:", error);
        });
      }
      
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const inputElement = e.target.elements.commentInput;
    const content = inputElement.value.trim();

    if (content) {
      handleCreateComment(content);
      inputElement.value = "";
    }
  };

  useEffect(() => {
    if (data) {
        setComments(data.getAllCommentByPost); 
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
      <div className="titleComment">
        <h2>{localStorage.getItem("openPostUser")}'s Post</h2>
        <hr/>
      </div>
      <div className="commentList">
        {comments.map((comment, index) => (
          <div key={comment.id} className="commentContainer">
            <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" className="profileImage" />
            <div className="commentInfo" style={{height:'max-content'}}>
              <div className="commentContent">
                <p className="userName">{comment.userName}</p>
                <p className="content" style={{padding:'10px 0px 5px 0px'}}>{comment.content}</p>
              </div>
              <div style={{display: 'flex'}}>
                <div onClick={() => clickLikeButton(index, comment.id)}>
                  {likeStates[index] ? (
                    <div className="timeAgo" style={{ color: "#2d86ff", cursor: "pointer", fontWeight:'bold' }}>
                      Like
                    </div>
                  ) : (
                    <div className="timeAgo"  style={{ cursor: "pointer" }}>
                      Like
                    </div>
                  )}
                </div>
                <p className="timeAgo" style={{ cursor: "pointer" }} onClick={handleShowInputReplay}>Reply</p>
                <p className="timeAgo">{formatDistanceToNow(new Date(comment.createDate))} ago</p>
                <div style={{ fontSize: '16px', color: '#9fa2a6', display: "flex", alignItems: "center", marginLeft:'15px'}}>
                  <i className="fa fa-thumbs-up" style={{ color: "white", backgroundColor: "#1877F2", padding: "5px", borderRadius: "50%", marginRight: "5px", fontSize:'10px' }}></i>
                  {likeCounts[index] || 0}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '23%', marginLeft: '-40%' }}>
              <GetAllReplyComment commentId={comment.id} replayInput={showInputReplay}/>
            </div>
          </div>
        ))}
      </div>
      <div className="createCommentContainer">
        <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" className="profileImage" />
        <form onSubmit={handleSubmitComment}>
          <input type="text" name="commentInput" />
          <button type="submit" style={{display:"none"}}>Post Comment</button>
        </form>
      </div>
    </div>

  );
};

export default GetAllComment;
