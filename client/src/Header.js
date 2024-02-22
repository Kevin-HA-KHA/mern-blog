import { useEffect } from "react";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import apiConfig from "./apiConfig";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  
  useEffect(() => {
    fetch(`${apiConfig.apiUrl}/profile`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de profil');
      }
      return response.json();
    })
    .then(userInfo => {
      setUserInfo(userInfo);
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

    return (
      <header>
        <Link to="/" className="logo">MonBlog</Link>
        <nav>
          {username && (
            <>
              <div>Bonjour <span className="headerUsername">{username}</span>,</div>
              <Link to="/create">Créer un nouveau post</Link>
              <Link onClick={logout}>Déconnexion</Link>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
            </>
          )}

          {/* <a href="/login">Connexion</a> */}
          {/* <a href="">Inscription</a> */}
        </nav>
      </header>
    )
}