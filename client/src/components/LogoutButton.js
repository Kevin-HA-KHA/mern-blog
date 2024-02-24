import React from 'react'
import {useAuth0} from '@auth0/auth0-react';
import {Link} from "react-router-dom";

function LogoutButton() {
    const {logout, isAuthenticated} = useAuth0();
    
    return (
        <div>
          {isAuthenticated && (
            <>
              <div>Bonjour <span className="headerUsername">utilisateur</span>,</div>
              <Link to="/create">Créer un nouveau post</Link>
              <Link onClick={() => logout()}>Déconnexion</Link>
            </>
          )}
        </div>
    )
}

export default LogoutButton