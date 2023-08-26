import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FIND_USER = gql`
    mutation UpdateActivate($id:ID!){
        updateActivate(id:$id)
    }
`;

const Verify = () => {
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [findUser, { data, loading, error }] = useMutation(FIND_USER);
    const params = useParams();
    const id = JSON.stringify(params.id).replace(/"/g, '');

    useEffect(() => {
        findUser({
          variables: {
            id: id,
          },
        })
          .then((result) => {
            setIsError(false);
          })
          .catch((error) => {
            setIsError(true)
          });

    }, []);

    useEffect(() => {
      let timeoutId;
    
      const navigateToLogin = () => {
        navigate('/login');
      };
    
      timeoutId = setTimeout(() => {
        navigateToLogin();
      }, 10000);
    
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);

    if(!isError){
      return (
        <div>
          <h1 style={{fontSize: 'clamp(10px, 5vw, 30px)'}}>Account Activated Successfully!</h1>
          <p>Your account has been successfully activated.</p>
        </div>
      )
    }

    return (
      <div>
        <h1 style={{fontSize: 'clamp(10px, 5vw, 30px)'}}>404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    );
        
};

export default Verify;
  