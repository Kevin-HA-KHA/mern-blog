import React from 'react'
import {useAuth0} from '@auth0/auth0-react';
import {Link} from "react-router-dom";

function LogoutButton() {
    const {loginWithRedirect, isAuthenticated} = useAuth0();
    
    return (
        <div>
          {!isAuthenticated && (
            <>
              <Link to="#" onClick={() => loginWithRedirect()}>Connexion</Link>
              <Link to="/register">Inscription</Link>
            </>
          )}
        </div>
    )
}

export default LogoutButton