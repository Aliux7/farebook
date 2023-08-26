import React, { useEffect, useState } from 'react';
import '../styles/index.css'
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import LoadingIndicator from './loadingIndicator';
import { formatDistanceToNow } from 'date-fns';
import GetAllComment from './GetAllComment';
import { getUser } from './GetUser';

const LOAD_REELS = gql`
  query GetAllReels {
    getAllReels{
      id
      userID
      userName
      dateReels
      textReels
      videoURL
      privacy
    }
  }
`;


const COUNT_COMMENT = gql`
  query CountAllCommentByPost($id:ID!){
    countAllCommentByPost(id:$id)
  }
`;

const COUNT_LIKE = gql`
  query CountAllLikeByPost($id:ID!){
    countAllLikeByPost(id:$id)
  }
`;

const CREATE_LIKE = gql`
  mutation CreateLike($inputLike:NewLike!){
    createLike(inputLike: $inputLike){
      id
      postID
      userID
      userName
      createDate
    }
  }
`;

const DELETE_LIKE = gql`
  mutation DeleteLike($postID:String!, $userID:String!){
    deleteLike(postID: $postID, userID: $userID){
      id
      postID
      userID
      userName
      createDate
    }
  }
`;

const CHECK_LIKE = gql`
  query CheckLikeByPost($postID:String!, $userID:String!){
    checkLikeByPost(postID: $postID, userID: $userID)
  }
`;

const ReelsCarousel = () => {
  const user = getUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const {data, loading, error} = useQuery(LOAD_REELS);
  
  const apolloClient = useApolloClient();
  const [createLike] = useMutation(CREATE_LIKE);
  const [deleteLike] = useMutation(DELETE_LIKE);

  const [likeStates, setLikeStates] = useState(Array.from({ length: 100 }, () => false));
  useEffect(() => {
    if(user === "") return
    const checkLikes = async () => {
      try {
        const userID = user?.getUserByToken?.id;

        const newLikeStates = await Promise.all(data.getAllReels.map(async (item) => {
          const postID = item.id;
  
          const { data } = await apolloClient.query({
            query: CHECK_LIKE,
            variables: { postID, userID },
          });
  
          console.log(`[${postID}] After query, Result:`, data.checkLikeByPost);
          return data.checkLikeByPost;
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
    if(user === "") return
    try {
      data.getAllReels.forEach(item => {
        const { id } = item;
        apolloClient.query({
          query: COUNT_LIKE,
          variables: { id },
        }).then(async result => {
          console.log("LIKEEE" + result);
          if (!result.error) {
            await setLikeCounts(prevCounts => ({
              ...prevCounts,
              [id]: result.data.countAllLikeByPost, 
            }));
          }
        });
      });
    } catch (error) {
      console.error("Error count likes:", error);
    }
  }, [data, apolloClient, user]);

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  useEffect(() => {
    if(user === "") return
    data.getAllReels.forEach(item => {
      const { id } = item;
      apolloClient.query({
        query: COUNT_COMMENT,
        variables: { id },
      }).then(async result => {
        if (!result.error) {
          await setCommentCounts(prevCounts => ({
            ...prevCounts,
            [id]: result.data.countAllCommentByPost,
          }));
        }
      });
    });
  }, [data, apolloClient, isCommentOpen, user]);



  if (loading) {
    return <LoadingIndicator loading={loading} />;
  }
  
  console.log(data?.getAllReels)

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? data.getAllReels.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === data.getAllReels.length - 1 ? 0 : prevIndex + 1));
  };

  
  const clickCommentButton = (postId, postUsername) => {
    localStorage.setItem("openPostId", postId)
    localStorage.setItem("openPostUser", postUsername)
    setIsCommentOpen(true);
  }

  const handleClosePost = () => {
    setIsCommentOpen(false);
    localStorage.setItem("openPost", "")
  };

  const clickLikeButton = async (index) => {
    const newLikeStates = [...likeStates];
    newLikeStates[index] = !newLikeStates[index];
    setLikeStates(newLikeStates); 
    
    const postID = data.getAllReels[currentIndex].id; 
    const userID = user?.getUserByToken?.id;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    const inputLike = {
      postID: postID,
      userID: userID,
      userName: user?.getUserByToken.firstName + " " + user?.getUserByToken.surName,
      createDate: formattedDate,
    };
  
    try {
      if (newLikeStates[index]) {
        console.log("INSERT")
        console.log(inputLike)

        createLike({ variables: { inputLike } })
          .then(result => {
          console.log("INSERT DONE");
        }).catch(error => {
            console.error("Error inserting:", error);
        });
      } else {
        console.log("DELETE")
        console.log(postID)
        console.log(userID)
        deleteLike({
          variables: { 
            postID: postID,
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

  console.log(data.getAllReels);
  return (
    <div style={{ position: 'relative', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div className="postHeader" style={{marginTop:'10px', marginLeft:'10px', position:'absolute', width:'100%', height:'100%', alignItems:'flex-start'}}>
        <div className="profileImageContainer">
          <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" style={{ width: '41px', height: '40px', borderRadius: '50%' }} />
        </div>
        <div className="userInfo">
          <h4>{data.getAllReels[currentIndex].userName}</h4>
          {data.getAllReels[currentIndex].privacy === 'public' && (
            <div className="privacy-info">
              <img src="/asset/earth.png" alt="Public" style={{ width: '15px', height: '15px', marginLeft: '0px',  marginRight: '5px' }} />
              <h6 className="privacy-text">Public</h6>
            </div>
          )}
          {data.getAllReels[currentIndex].privacy === 'friend' && (
            <div className="privacy-info">
              <img src="/asset/friend.png" alt="Friend" className="privacy-icon" style={{ width: '15px', height: '15px', marginLeft: '0px',  marginRight: '5px' }} />
              <h6 className="privacy-text">Public</h6>
            </div>
          )}
        </div>
        <div style={{position:'absolute', bottom:'100px'}}>{data.getAllReels[currentIndex].textReels}</div>
      </div>
      <div
        onClick={handlePrev}
        style={{
          position: 'absolute',
          top: '50%',
          left: '-70px',
          zIndex: 2, // Add this line to adjust the stacking order
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginLeft: '10px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#60;
      </div>
        <video loop controls autoPlay style={{maxWidth:'300px', width:'60vw', borderRadius:'10px'}} src={data.getAllReels[currentIndex].videoURL}></video>
      <div
        onClick={handleNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-70px',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginRight: '10px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#62;
      </div>
      <div className='postFooter'>
        <div style={{fontSize:'18px', color: '#9fa2a6', display: 'flex', justifyContent: 'center', gap:'25%'}}>
          <div onClick={() => clickLikeButton(currentIndex)}>
            {likeStates[currentIndex] ? (
              <div style={{ color: "#2d86ff", cursor: "pointer" }}>
                <i className="fa fa-thumbs-up" style={{ color: "#2d86ff", cursor: "pointer" }} />
              </div>
            ) : (
              <div style={{ cursor: "pointer" }}>
                <i className="fa fa-thumbs-o-up" />
              </div>
            )}
            {likeCounts[data.getAllReels[currentIndex].id] || 0}
          </div>
          <div onClick={() => clickCommentButton(data.getAllReels[currentIndex].id, data.getAllReels[currentIndex].userName)} style={{ display:'flex', cursor: "pointer", flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <i className='far fa-comment-alt'></i>
            {commentCounts[data.getAllReels[currentIndex].id] || 0}
          </div>
          <div>
            <i className="fa fa-share"></i> 
          </div>
        </div>
      </div>
      {isCommentOpen && (
        <div className="overlay" onClick={handleClosePost}>
          <div className="commentContainer" onClick={(e) => e.stopPropagation()}>
            <GetAllComment/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsCarousel;
