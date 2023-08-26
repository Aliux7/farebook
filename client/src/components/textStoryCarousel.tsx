import React, { useEffect, useState } from 'react';
import '../styles/index.css'
import { gql, useApolloClient, useQuery } from '@apollo/client';

const LOAD_MEDIA = gql`
  query GetAllMediaByPost($id:ID!){
    getAllMediaByPost(id:$id){
      id
      postID
      mediaURL
    }
  }
`;

const TextStoryCarousel = ({ storySelected }) => {
  if(storySelected?.length == 0) return
  
  const apolloClient = useApolloClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediasURL, setMediasURL] = useState<{ postId: string; mediaURLs: string[] }[]>([]);

  const [progress, setProgress] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? storySelected.length - 1 : prevIndex - 1));
    setProgress(0); 
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === storySelected.length - 1 ? 0 : prevIndex + 1));
    setProgress(0); 
  };

  useEffect(() => {
    setMediasURL([]);
    console.log(storySelected);
    storySelected.forEach((item, i) => {
      const { id, imageStory } = item;
      console.log(id, imageStory);
      if (imageStory) {
        apolloClient.query({
          query: LOAD_MEDIA,
          variables: { id },
        }).then(result => {
          if (!result.error) {
            setMediasURL(prevMediasURL => {
              const updatedMedias = [...prevMediasURL];
              updatedMedias[i] = {
                postId: id,
                mediaURLs: result.data.getAllMediaByPost.map(media => media.mediaURL),
              };
              return updatedMedias;
            });
          }
        });
      } else {
        setMediasURL(prevMediasURL => {
          const updatedMedias = [...prevMediasURL];
          updatedMedias[i] = { postId: '', mediaURLs: [] };
          return updatedMedias;
        });
      }
    });

    // Automatically switch to the next card every 5 seconds
    const interval = setInterval(() => {
      setProgress(0); // Reset progress bar
      setCurrentIndex(prevIndex => (prevIndex + 1) % storySelected.length); // Move to next card
    }, 5000);

    // Update progress bar every 100 milliseconds (0.1 seconds)
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => (prevProgress + 1) % 100); // Increment progress
    }, 50);

    // Cleanup the intervals on unmount or when storySelected changes
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [storySelected, apolloClient, currentIndex]);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [storySelected]);
  
  if(!mediasURL) return
  if(mediasURL.length == 0) return

  if (storySelected.length <= 1) {
    console.log("TEST1")
    return storySelected[currentIndex].imageStory ? (
      <img
        src={mediasURL[currentIndex].mediaURLs[0]}
        alt={`Media 1`}
        style={{ width: '300px', height:'450px', display: 'block' }}
      />
    ) : (
      <div style={{ backgroundColor: storySelected[currentIndex].backgroundStory, width: '300px', height:'450px', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'20px' }}>
        <div style={{fontFamily: storySelected[currentIndex].fontStory, fontSize:'30px'}}>
          {storySelected[currentIndex].textStory}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'row', width:'max-content', alignItems:'center'}}>
      <div
        onClick={handlePrev}
        style={{
          top: '50vh',
          left: '45vw',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginLeft: '-50px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#60;
      </div>
      {storySelected[currentIndex].imageStory ? (
         <div style={{   backgroundImage: `url(${mediasURL[currentIndex]?.mediaURLs[0]})`, backgroundPosition:'center', backgroundSize:'contain', width: '300px', height:'450px', display:'flex', justifyContent:'center', alignItems:'center', 
         borderRadius:'20px', fontFamily: storySelected[currentIndex].fontStory, fontSize:'30px',position:"relative" }}>
             {storySelected[currentIndex].textStory}
             <div className="progress-bar-container" style={{display:'flex', justifyContent:'space-between', paddingTop:'15px', marginTop:'0px', position:"absolute", top:"0",width:"100%"}}>
             {storySelected.map((eachStory, index) => (
               <div style={{height:'10px', width:'100%', backgroundColor:'#9c9b9b', margin:'0px 1px', borderRadius:'3px'}}>
                 {currentIndex === index ? (
                   <div style={{height:'10px', width:`${progress}%`, backgroundColor:'white', margin:'0px 1px', borderRadius:'3px', transition:'none'}}></div>
                   ) : null}
               </div>
             ))}
           </div>
         </div>
      ) : (
        
      <div style={{ backgroundColor: storySelected[currentIndex].backgroundStory, width: '300px', height:'450px', display:'flex', justifyContent:'center', alignItems:'center', 
      borderRadius:'20px', fontFamily: storySelected[currentIndex].fontStory, fontSize:'30px',position:"relative" }}>
          {storySelected[currentIndex].textStory}
          <div className="progress-bar-container" style={{display:'flex', justifyContent:'space-between', paddingTop:'15px', marginTop:'0px', position:"absolute", top:"0",width:"100%"}}>
          {storySelected.map((eachStory, index) => (
            <div style={{height:'10px', width:'100%', backgroundColor:'#9c9b9b', margin:'0px 1px', borderRadius:'3px'}}>
              {currentIndex === index ? (
                <div style={{height:'10px', width:`${progress}%`, backgroundColor:'white', margin:'0px 1px', borderRadius:'3px', transition:'none'}}></div>
                ) : null}
            </div>
          ))}
        </div>
      </div>
      )}
      <div
        onClick={handleNext}
        style={{
          top: '50vh',
          right: '36vw',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginRight: '-50px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#62;
      </div>
    </div>
  );
};

export default TextStoryCarousel;
