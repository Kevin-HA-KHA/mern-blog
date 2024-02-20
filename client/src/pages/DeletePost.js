import {useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function DeletePost() {
    const {id} = useParams();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        async function deleteAPost() {
            const response = await fetch(`http://localhost:4000/post/${id}`,{
              method: 'DELETE',
              credentials: 'include',
            });
            if (response.ok) {
                setRedirect(true);
            }
          }
          deleteAPost();
    }, [])

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <>
            Suppression en cours...
        </>
    )
}