import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import InfiniteScroll from 'react-infinite-scroll-component';
import { animateScroll as scroll } from 'react-scroll';
import { FaSpinner } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import '../styles/Home.css';
import '../styles/Comment.css';
import { formatDistanceToNow } from 'date-fns';
import GetAllComment from './GetAllComment';
import ManualCarousel from './manualCarousel';
import { getUser } from './GetUser';
import LoadingIndicator from './loadingIndicator';

const GET_ALL_PUBLIC_POST = gql`
  query SearchAllPost($search:String!, $offset: Int, $limit: Int){
    searchAllPost(search:$search, offset:$offset, limit:$limit){
      id
      userID
      userName
      datePost
      textPost
      privacy
    }
  }
`;

const COUNT_COMMENT = gql`
  query CountAllCommentByPost($id:ID!){
    countAllCommentByPost(id:$id)
  }
`;

const LOAD_MEDIA = gql`
  query GetAllMediaByPost($id:ID!){
    getAllMediaByPost(id:$id){
      id
      postID
      mediaURL
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id:ID!){
    deletePost(id:$id){
      id
      userID
      userName
      datePost
      textPost
      privacy
    }
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

const GetAllPosts = ({search}) => {
  const user = getUser();
  const apolloClient = useApolloClient();
  const [itemsLoaded, setItemsLoaded] = useState(3);
  const [deletePost] = useMutation(DELETE_POST);
  const [createLike] = useMutation(CREATE_LIKE);
  const [deleteLike] = useMutation(DELETE_LIKE);
  const { data, loading, error, fetchMore } = useQuery(GET_ALL_PUBLIC_POST, {
    variables: { search: search, limit: 3, offset: 0 },
  });
  
  const items = data?.searchAllPost || []; 
  // const [items, setItems] = useState(data?.searchAllPost || []);
  const [likeStates, setLikeStates] = useState(Array.from({ length: 100 }, () => false));
  useEffect(() => {
    // if(!user) return;
    const checkLikes = async () => {
      try {
        const userID = user?.getUserByToken.id;

        const newLikeStates = await Promise.all(items.map(async (item) => {
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
  }, [items, apolloClient, user]);


  const [likeCounts, setLikeCounts] = useState({});
  useEffect(() => {
    try {
      items.forEach(item => {
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
  }, [items, apolloClient]);

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  useEffect(() => {
    items.forEach(item => {
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
  }, [items, apolloClient, isCommentOpen]);
  
  const [mediasURL, setMediasURL] = useState<{ postId: string; mediaURLs: string[] }[]>([]);
  const [mediasLoading, setMediasLoading] = useState(true); // Add a loading state
  useEffect(() => {
    items.forEach(item => {
      const { id } = item;
      apolloClient.query({
        query: LOAD_MEDIA,
        variables: { id },
      }).then(result => {
        if (!result.error) {
          if (!mediasURL.some(media => media.postId === id)) {
            setMediasURL(prevMedias => [
              ...prevMedias,
              { postId: id, mediaURLs: result.data.getAllMediaByPost.map(media => media.mediaURL) },
            ]);
          }
        }
      }).finally(() => {
        console.log(mediasURL);
        setMediasLoading(false);
      })
    });
  }, [items, apolloClient]);

  const handleDeletePost = async (postId) => {
    try {
      deletePost({ variables: { id: postId }})
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const clickLikeButton = async (index) => {
    const newLikeStates = [...likeStates];
    newLikeStates[index] = !newLikeStates[index];
    setLikeStates(newLikeStates); 
    
    const postID = items[index].id; 
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

  const clickCommentButton = (postId, postUsername) => {
    localStorage.setItem("openPostId", postId)
    localStorage.setItem("openPostUser", postUsername)
    setIsCommentOpen(true);
  }
  
  const handleClosePost = () => {
    setIsCommentOpen(false);
    localStorage.setItem("openPost", "")
  };


  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (scrollPosition > 0) {
      scroll.scrollTo(scrollPosition, {
        duration: 200,
        smooth: true,
      });
    }
  }, [scrollPosition]);

  if (loading) return <div><LoadingIndicator loading={loading} /></div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(commentCounts)
  console.log(mediasURL);

  window.onscroll = async function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      console.log("Target")
      if (items.length < itemsLoaded) {
        return;
      }else{
        // const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
        setItemsLoaded(itemsLoaded + 3);
        // setScrollPosition(currentPosition);
        await fetchMore({
          variables: { search: search, limit: 3, offset: itemsLoaded },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              searchAllPost: [...prev.searchAllPost, ...fetchMoreResult.searchAllPost],
            };
          },
        });
      }
    }
  }

  
  return (
    <div>
        {items.map((item,index) => (
          <div key={item.id} className="postContainer">
            <div className="postComponent">
              {item.privacy === 'public' && <p style={{ color: '#9fa2a6', margin: '10px 0px' }}>Recommended for you</p>}
              <hr style={{ height: '1px', borderWidth: '0', backgroundColor: '#9fa2a6', margin: '10px 0' }} />
              <div className="postHeader">
                <div className="profileImageContainer">
                  <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" style={{ width: '41px', height: '40px', borderRadius: '50%' }} />
                </div>
                <div className="userInfo">
                  <h4>{item.userName}</h4>
                  {item.privacy === 'public' && (
                    <div className="privacy-info">
                      <h6 className="privacy-text">{formatDistanceToNow(new Date(item.datePost))} ago</h6>
                      <img src="/asset/earth.png" alt="Public" style={{ width: '15px', height: '15px', marginLeft: '5px' }} />
                    </div>
                  )}
                  {item.privacy === 'friend' && (
                    <div className="privacy-info">
                      <h6 className="privacy-text">{formatDistanceToNow(new Date(item.datePost))} ago</h6>
                      <img src="/asset/friend.png" alt="Friend" className="privacy-icon" />
                    </div>
                  )}
                </div>
                {item.userID === user?.getUserByToken?.id && (  
                      <i className="fa fa-remove" aria-hidden="true" onClick={() => handleDeletePost(item.id)} style={{marginLeft:'20vw', marginBottom:'2%', color:'var(--body_color)', cursor:'pointer'}}></i>
                )}
              </div>
              <p className="longText" style={{ marginTop: '20px' }}>
                {item.textPost.length > 500 ? (
                  <span><div dangerouslySetInnerHTML = {{ __html: item.textPost}}/></span>
                  ) : (
                  <div dangerouslySetInnerHTML = {{ __html: item.textPost}}/>
                )}
              </p>
            </div>
            {mediasLoading ? (
              <p>Loading media...</p> // Display loading indicator while media is being fetched
            ) : (
              mediasURL.map((media, i) => (
                media.postId === item.id && i < itemsLoaded && (
                  <div>
                  <ManualCarousel key={i} mediaURLs={media.mediaURLs} />
                  </div>
                )
              ))
            )}
            
            <div className='postFooter'>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: '18px', color: '#9fa2a6', display: "flex", alignItems: "center" }}>
                  <i className="fa fa-thumbs-up" style={{ color: "white", backgroundColor: "#1877F2", padding: "5px", borderRadius: "50%", marginRight: "5px" }}></i>
                  {likeCounts[item.id] || 0}
                </div>
                <div style={{ fontSize: '18px', color: '#9fa2a6' }}>
                  {commentCounts[item.id] || 0} <i className='far fa-comment-alt'></i> 13K <i className="fa fa-share"></i>
                </div>
              </div>

              <hr style={{ height: '1px', borderWidth: '0', backgroundColor: '#9fa2a6', margin: '10px 0' }} />
              <div style={{fontSize:'18px', color: '#9fa2a6', display: 'flex', justifyContent: 'center', gap:'25%'}}>
                <div onClick={() => clickLikeButton(index)}>
                  {likeStates[index] ? (
                    <div style={{ color: "#2d86ff", cursor: "pointer" }}>
                      <i className="fa fa-thumbs-up" style={{ color: "#2d86ff", cursor: "pointer" }} /> Like
                    </div>
                  ) : (
                    <div style={{ cursor: "pointer" }}>
                      <i className="fa fa-thumbs-o-up" /> Like
                    </div>
                  )}
                </div>
                <div onClick={() => clickCommentButton(item.id, item.userName)} style={{ cursor: "pointer" }}>
                  <i className='far fa-comment-alt'></i> Comment
                </div>
                <div>
                  <i className="fa fa-share"></i> Share
                </div>
              </div>
            </div>
          </div>
        ))}
      {isCommentOpen && (
        <div className="overlay" onClick={handleClosePost}>
          <div className="commentContainer" onClick={(e) => e.stopPropagation()}>
            <GetAllComment/>
            {/* <h2>Create Post</h2>
            <hr/>
            <div className="postHeader">
              <div className="profileImageContainer">
                <img src="/asset/navLogoProfile/defaultProfile.jpg" alt="Profile" style={{ width: '41px', height: '40px', borderRadius: '50%' }} />
              </div>
              <div className="userInfo">
                <h4>{user}</h4>
                <select value={privacy} onChange={handlePrivacyChange}>
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="specific-friends">Specific Friends</option>
                </select>
              </div>
            </div>
            <ReactQuill   
              className="inputRichText"
              theme="snow" 
              value={textPost} 
              onChange={setTextPost}
              placeholder="What do you think?"/>
            <label htmlFor="fileInput" className={`customFileInput ${fileSelected ? 'fileSelected' : ''}`}>
              Add to Your Posts
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleFileChange(e)
                setFileSelected(1 > 0); 
              }}
            />
            <div className="inputBox">
              <input type="submit" value="Login" onClick={handleSubmitPost} style={{marginTop:'10px', cursor:'pointer', padding:"10px 0px", backgroundColor:"#2374e1"}}/>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllPosts;
