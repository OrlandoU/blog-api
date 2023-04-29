import { useContext, useState } from "react"
import { useParams } from "react-router"
import { TokenContext } from '../../Contexts/TokenContext'
import { toast } from "react-hot-toast"
import { UserContext } from "../../Contexts/UserContext"

export default function CommentForm({ cb }) {
    const tokenContext = useContext(TokenContext)
    const user = useContext(UserContext)
    const [content, setContent] = useState('')
    const urlParams = useParams()

    const createComment = async () => {
        try {
            const result = await fetch('http://localhost:3000/posts/' + urlParams.id + '/comments', {
                method: 'POST',
                body: JSON.stringify({ content }),
                headers: { 'Content-Type': "application/json", authorization: 'bearer ' + tokenContext.userToken }
            })
            setContent('')
            const data = await result.json()
            if (result.ok) {
                cb(prevState => [data, ...prevState])
            } else {
                throw new Error(data)
            }
        } catch (error) {
            console.error('Error creating post', error)
            throw new Error(error)
        }
    }

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const promise = createComment()
        toast.promise(promise, {
            loading: 'Creating Comment',
            success: 'Comment Created',
            error: 'Error creating comment'
        })
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <h1>Comment Section</h1>
            {user._id && <div className="comment-input">
                <input type="text" value={content} onInput={handleContent} placeholder="Write your message here..." />
                <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg></button>
            </div>}

        </form>
    )
}