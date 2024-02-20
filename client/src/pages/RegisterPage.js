import {useState} from "react";
import apiConfig from "../apiConfig";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function register(e) {  
        e.preventDefault();
        const response = await fetch(`${apiConfig.apiUrl}/register`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
        })
        if (response.status === 200) {
            alert('Inscription effectuée')
        } else {
            alert('Inscription échouée')
        }
    }
    return (
        <form className="register" onSubmit={register}>
            <h1>Inscription</h1>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <button>Inscription</button>
        </form>
    )
}