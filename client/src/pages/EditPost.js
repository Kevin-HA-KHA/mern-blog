import {useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from './Editor';
import apiConfig from '../apiConfig';


export default function EditPost() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      fetch(`${apiConfig.apiUrl}/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        })
      })
    }, [id])

    async function updatePost(e) {
      e.preventDefault();
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('id', id);
      if (files?.[0]) {
        data.set('file', files?.[0]);
      }
      const response = await fetch(`${apiConfig.apiUrl}/post`,{
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
      if (response.ok) {
        setRedirect(true);
      }
    }

    if (redirect) {
        return <Navigate to={'/post/'+id} />
      }


      return (
          <form onSubmit={updatePost}>
              <input type="title" placeholder="Titre" value={title} onChange={e => {setTitle(e.target.value)}} />
              <input type="summary" placeholder="Résumé" value={summary} onChange={e => {setSummary(e.target.value)}} />
              <input type="file" onChange={e => {setFiles(e.target.files)}} />
              <Editor onChange={setContent} value={content} />
              {/* <ReactQuill value={content} onChange={newValue => {setContent(newValue)}} modules={modules} formats={formats} /> */}
              <button style={{marginTop:'5px'}}>Modifier un post</button>
          </form>
      )
}