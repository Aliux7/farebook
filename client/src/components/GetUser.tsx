import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { encryptStorage } from "../App";

const CURR_USER = gql`
  mutation GetUserByToken($token:String!){
    getUserByToken(token:$token){
      id
      profilePicture
      firstName
      surName
      email
      dob
      gender
    }
  }
`;


export const getUser = () => {
    const [token, setToken] = useState<any>("");
    const [data, setData] = useState<any>("");

    useEffect(() => {
        if (encryptStorage.getItem("jwtToken"))
            setToken(encryptStorage.getItem("jwtToken"))
    }, [])

    const [getUserWToken] = useMutation(CURR_USER)

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const response = await getUserWToken({
                        variables: {
                            token: token
                        }
                    });
                    await setData(response.data);
                    return data;
                } catch (err) {
                    console.log(err);
                }
            }
        };

        fetchData();
    }, [token]);

    return data !== null ? data : null;
};