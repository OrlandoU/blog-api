import { useEffect, useState } from "react"
import Preview from "../Post/Preview"


export default function Home() {
    const [posts, setPosts] = useState([])

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts?isPublished=true', {
                method: 'GET'
            })
            const data = await response.json()
            setPosts(data.length > 0 ? data : [])
        } catch (error) {
            console.error('Error fetching posts', error)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <main>
            <h1>Blog Posts</h1>
            <div className="posts-container">
                {posts.map(post =>
                    <Preview {...post} fetchPosts={fetchPosts}/>
                )}
            </div>
        </main>
    )
}