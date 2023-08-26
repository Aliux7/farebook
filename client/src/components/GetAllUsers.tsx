import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const LOAD_USERS = gql`
    query GetAllUser{
        getAllUser {
            id
            name
            email
            username
        }
    }
`;

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

function GetUsers() {
  const { error, loading, data } = useQuery(LOAD_USERS);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data.getAllUser); 
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
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default GetUsers;
