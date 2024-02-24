import { useEffect } from "react";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import apiConfig from "./apiConfig";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

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
          <LoginButton />
          <LogoutButton />
          {/* <a href="/login">Connexion</a> */}
          {/* <a href="">Inscription</a> */}
        </nav>
      </header>
    )
}