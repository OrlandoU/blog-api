import { useContext, useEffect, useState } from 'react'
import '../../assets/stylesheets/User.css'
import Preview from '../Post/Preview'
import { UserContext } from '../../Contexts/UserContext'

export default function User({ handleLogout }) {
    const user = useContext(UserContext)

    const [posts, setPosts] = useState([])

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://expressblog.fly.dev/posts?isPublished=false', {
                method: 'GET'
            })
            const data = await response.json()
            setPosts(data.length > 0 ? data : [])
        } catch (error) {
            console.error('Error fetching posts', error)
        }
    }


    useEffect(() => {
        if (user.isAdmin) {
            fetchPosts()
        }
    }, [user])

    return (
        <main className="user-container">
            <h1>User</h1>
            <div className="user-data-container">
                <p><strong>Username: </strong><span>{user.username}</span></p>
                <p><strong>Email: </strong><span>{user.email}</span></p>
                <p><strong>Status: </strong><span className={user.isAdmin ? "Admin status" : "Guest status"}>{user.isAdmin ? "Admin" : "Guest"}</span></p>
                <div className="input-button" onClick={handleLogout}>Logout</div>
            </div>
            {(user.isAdmin && posts.length > 0) &&
                <>
                    <h1>Unpublished Posts</h1>
                    <div className="posts-container">
                        {posts.map(post =>
                            <Preview {...post} fetchPosts={fetchPosts} isDash />
                        )}
                    </div>
                </>
            }
        </main>
    )
}