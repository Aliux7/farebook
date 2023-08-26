import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loadingIndicator";

const CREATE_GROUP = gql`
    mutation CreateGroup($inputGroup:NewGroup!){
        createGroup(inputGroup:$inputGroup){
            id
            Name
            Privacy
            CreateDate
        }
    }
`;

const GroupCreate = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupPrivacy, setGroupPrivacy] = useState("Public");
  const [createGroup] = useMutation(CREATE_GROUP);
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = () => {
    if(groupName.trim() === "") return
    setLoading(true);
    createGroup({
        variables: {
            inputGroup: {
                Name: groupName,
                Privacy: groupPrivacy,
                CreateDate: "now",
            },
        },
    }).then(() => {
        navigate("/");
        setLoading(false);
        setGroupName("");
        setGroupPrivacy("Public");
    })
  }

  return (
    <div style={{width:'100vw', minHeight:'100vh', position:'relative', display:'flex', justifyContent:'flex-end'}}>
        <div className="sidebar" style={{position:'sticky', top:'0px', left:'0px', height:'100vh', width:'25vw'}}>
            <div style={{marginTop:'80px', marginLeft:'20px'}}>
                <h2>Create group</h2>
                <input
                    type="text"
                    className="group-input"
                    placeholder="Group Name"
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <select style={{marginLeft:'10px'}} onChange={(e) => setGroupPrivacy(e.target.value)}>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
            </div>
            <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                <div className="button-create-group" 
                    style={{
                        backgroundColor: groupName !== "" ? "#3c91ff" : "gray",
                        borderRadius:'10px'
                    }}
                    onClick={handleCreateGroup}
                    >Create</div>
            </div>
        </div>
        <div className="group-preview-container">
            <div className="inner-group-preview-container">
                <div>
                    <img src="/asset/defaultBackground.png" style={{width:'100%'}}/>
                    <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                        <div style={{height:'50px', padding:'10px'}}>
                            <h1>{groupName}</h1>
                        </div>
                        <p className="timeAgo" style={{fontSize:'15px'}}>{groupPrivacy} group - 1 member</p>
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <div style={{border:'1px solid grey', width:'98%', margin:'10px 0px'}}></div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{margin:'10px', fontWeight:'bold'}} className="timeAgo">About</div>
                        <div style={{margin:'10px', fontWeight:'bold'}} className="timeAgo">Posts</div>
                        <div style={{margin:'10px', fontWeight:'bold'}} className="timeAgo">Members</div>
                        <div style={{margin:'10px', fontWeight:'bold'}} className="timeAgo">Events</div>
                    </div>
                </div>
                <div style={{display:'flex'}}>
                    <div style={{backgroundColor:'var(--body_background)', borderRadius:'5px', width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-start', }}>
                        <div style={{backgroundColor:'var(--header_background)', display:'flex', justifyContent:'center', alignItems:'center', width:'70%', margin:'10px 3px 10px 10px', padding:'10px', borderRadius:'10px'}}>       
                            <input
                                type="text"
                                className="group-input"
                                placeholder="What's on your mind?"
                                style={{backgroundColor:'var(--scroll_background)', borderRadius:'30px', border:'0', padding:'10px 30px', margin:'0px'}}
                            />
                        </div>
                        <div style={{backgroundColor:'var(--header_background)', display:'flex', flexDirection:'column', width:'70%', margin:'10px 3px 10px 10px', padding:'20px 10px 10px 20px', borderRadius:'10px'}}>
                            <h4>About</h4>
                            <div style={{margin:'20px'}}>
                                <div style={{margin:'0px 0px 10px 0px'}}>{groupPrivacy}</div>
                                <div style={{margin:'20px 0px 0px 0px'}}>Visiable</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      {loading && (
        <div className="overlay">
          <LoadingIndicator  loading={loading} />
        </div>
      )}
    </div>
  );
};

export default GroupCreate;
