import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import Comment from "./Comment"
import CommentForm from "./CommentForm"
import '../../assets/stylesheets/Post.css'
import { UserContext } from "../../Contexts/UserContext"
import Modal from "../Modal"
import PostForm from "./PostForm"

export default function Post() {
    const urlParams = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const userContext = useContext(UserContext)

    const fetchPost = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts/' + urlParams.id)
            const data = await response.json()
            console.log(data)
            setPost(data)
        } catch (error) {
            console.error('Error fetching post', error)
        }
    }

    const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts/' + urlParams.id + '/comments')
            const data = await response.json()
            console.log(data)
            setComments(data)
        } catch (error) {
            console.error('Error fetching post', error)
        }
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])

    return (
        <main className="post-container">
            {post.title &&
                <>
                    <Modal id={post._id + "update"}>
                        <PostForm fetchPosts={post.fetchPosts} idProp={post._id} formTitle={'Update Post'} fileProp={post.cover} titleProp={post.title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")} contentProp={post.content.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")} />
                    </Modal>
                    <Modal id={post._id + 'delete'}>
                        <h1>Delete Post</h1>
                        <h2>Are you sure you want to delete this post?</h2>
                        <div className="post-info">
                            <div className="name">
                                <strong>ID: </strong>{post._id}
                            </div>
                            <div className="name">
                                <strong>Title: </strong>{post.title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}
                            </div>
                            <div className="name">
                                <strong>Creation Date: </strong>{post.create_date}
                            </div>
                            <img src={"http://localhost:3000/images/" + post.cover} alt="" />
                            <button className="delete-button" onClick={post.handleDelete}>
                                Delete Post
                            </button>
                        </div>
                    </Modal>
                </>
            }
            <div className="post">
                {post.title && <h1>{post.title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}</h1>}
                {post.cover && <img src={"http://localhost:3000/images/" + post.cover} alt="post-cover"/>}
                {post.content && <p>{post.content.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}</p>}
                <p className="post-date"><strong>Posted on</strong> {post.create_date}</p>
                {userContext.isAdmin && <div className="options">
                    <label className="input-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye-off-outline</title><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z" /></svg>
                        Unpublish Post
                    </label>
                    <label className="input-button" htmlFor={post._id + "update"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>update</title><path d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" /></svg>
                        Update Post
                    </label>
                    <label className="delete-button" htmlFor={post._id + "delete"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete-svg</title><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" /></svg>
                        Delete Post
                    </label>
                </div>}
            </div>
            <div className="post-comments">
                <CommentForm cb={setComments} />
                <div className="comments">
                    {comments.map(comment =>
                        <Comment {...comment} />
                    )}
                </div>
            </div>
        </main>
    )
}