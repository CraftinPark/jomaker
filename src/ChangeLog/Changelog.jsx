import React, {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'

function Changelog(){
    const[posts, setPosts] = useState([])
    const importAllPosts = (r) => r.keys().map(r)
    const markdownFiles = importAllPosts(
        require.context('./ReleaseNotes', false, /\.md$/)
    )
        .sort()
        .reverse()
    useEffect(() => {
        const getPosts = async () => {
            await Promise.all(
                markdownFiles.map((file) =>{
                    return fetch(file).then((res) => res.text())
                })
            )
                .then((res) => setPosts(res))
                .catch((err) => console.error(err))
        }
        getPosts()
    }, [])

    const card = {
        width: '100%',

    }
    
    return(
        <>
            <div>
                {posts.map((post, idx) => (
                    <div style={card} key={idx}>
                        <ReactMarkdown>{post}</ReactMarkdown>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Changelog