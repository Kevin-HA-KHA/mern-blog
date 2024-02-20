import { useEffect, useState } from "react";
import Post from "../Post";
import apiConfig from "../apiConfig";

export default function IndexPage() {
    const [posts, setPosts] = useState('');
    useEffect(() => {
        fetch(`${apiConfig.apiUrl}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []); 
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
    )
}