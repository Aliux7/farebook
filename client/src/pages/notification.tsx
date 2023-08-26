import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getUser } from "../../src/components/GetUser";
import LoadingIndicator from "../components/loadingIndicator";
import "../../src/styles/Notification.css"
import { formatDistanceToNow } from "date-fns";
import GroupInfo from "../components/GroupInfo";

const GET_NOTIFICATION = gql`
    query GetAllNotificationByUser($id:ID!, $all:Boolean){
        getAllNotificationByUser(id:$id, all:$all){
        id
        userID
        content
        createDate
        status
        }
    }
`;

const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id:ID!){
    updateNotifcation(id:$id){
    id
    userID
    content
    createDate
    status
  } 
  }
`;

const GET_PENDING_GROUP = gql`
  query GetAllPendingByUserID($userID:String!){
    getAllPendingByUserID(UserID:$userID){
      id
      GroupID
      UserID
    }
  }
`;

const Notification = () => {
  const user = getUser();
  const [ all, setAll ] = useState(true);
  const [ groupPending, setGroupPending ] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_NOTIFICATION, {
    variables: {
        id: user?.getUserByToken?.id,
        all: all
    }
  })

  const {data: groupPendingData, loading: groupPendingLoading, refetch: groupPendingRefetch} = useQuery(GET_PENDING_GROUP, {
    variables: {
      userID: user?.getUserByToken?.id,
    }
  })

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user]);

  if (loading) return <div><LoadingIndicator loading={loading}/></div>;
  if (groupPendingLoading) return <div><LoadingIndicator loading={groupPendingLoading}/></div>;
  if (error) return <div>Error loading notifications: {error.message}</div>;

  const handleClickNotif = (status, id) => {
    if (status === "unread") {
      updateNotification({
        variables: {
          id: id,
        },
      })
        .then(() => {
          refetch();
        })
        .catch(error => {
          console.error("Error updating notification:", error);
        });
    }
  };

  console.log(groupPendingData?.getAllPendingByUserID)
  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <div className="filter-options">
        <div
          className={`filter-option ${all ? 'active' : ''}`}
          onClick={() => {setAll(true), setGroupPending(false)}}
        >
          All
        </div>
        <div
          className={`filter-option ${!all ? 'active' : ''}`}
          onClick={() => {setAll(false), setGroupPending(false)}}
        >
          Unread
        </div>
        <div
          className={`filter-option ${groupPending ? 'active' : ''}`}
          onClick={() => {setGroupPending(true)}}
        >
          Group Invitation
        </div>
      </div>
      <div className="notification-list" style={{ height: '50vh', overflowY: 'scroll' }}>
        {groupPending && groupPendingData?.getAllPendingByUserID?.length > 0 ? (
          <div>
            {groupPendingData?.getAllPendingByUserID?.map((group) => (
              <div key={group.id} className="notification-item">
                <div style={{ display: 'flex', marginRight: '30px' }}>
                  <img
                    src="/asset/navLogoProfile/defaultProfile.jpg"
                    style={{ borderRadius: '50%', marginRight: '20px' }}
                    alt="Profile"
                  />
                  <div style={{ flexDirection: 'column' }}>
                    <GroupInfo groupID={group.GroupID} id={group.id} groupPendingRefetch={groupPendingRefetch}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !groupPending && data?.getAllNotificationByUser.length > 0 ? (
            data.getAllNotificationByUser.map((notification) => (
              <div key={notification.id} className="notification-item" onClick={() => handleClickNotif(notification.status, notification.id)}>
                <div style={{ display: 'flex', marginRight: '30px' }}>
                  <img src="/asset/navLogoProfile/defaultProfile.jpg" style={{ borderRadius: '50%', marginRight: '20px' }} alt="Profile" />
                  <div style={{ flexDirection: 'column' }}>
                    <p>{notification.content}</p>
                    {notification.status === "unread" ? (
                      <p className="createDate" style={{ color: '#3c91ff' }}>{formatDistanceToNow(new Date(notification.createDate))} ago</p>
                    ) :
                      <p className="createDate">{formatDistanceToNow(new Date(notification.createDate))} ago</p>
                    }
                  </div>
                </div>
                {notification.status === "unread" && (
                  <div style={{ backgroundColor: '#3c91ff', width: '10px', height: '10px', borderRadius: '50%', display: 'flex', marginBottom: '15px' }}></div>
                )}
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '400px', flexDirection: 'column' }}>
              <img src="/asset/navLogoProfile/unselectedNotification.png" style={{ width: '200px', marginBottom: '20px' }} alt="No Notifications" />
              <h2>You have no notifications</h2>
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default Notification;
