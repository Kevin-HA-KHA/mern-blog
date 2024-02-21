import {useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';
import apiConfig from '../apiConfig';

export default function DeletePost() {
    const {id} = useParams();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        async function deleteAPost() {
            const response = await fetch(`${apiConfig.apiUrl}/post/${id}`,{
              method: 'DELETE',
              credentials: 'include',
            });
            if (response.ok) {
                setRedirect(true);
            }
          }
          deleteAPost();
    }, [id])

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <>
            Suppression en cours...
        </>
    )
}