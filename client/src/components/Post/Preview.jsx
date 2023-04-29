import { useContext, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from '../Modal'
import PostForm from '../Post/PostForm'
import { toast } from "react-hot-toast";
import { TokenContext } from "../../Contexts/TokenContext";
import { UserContext } from '../../Contexts/UserContext'

export default function Preview({ title, content, create_date, cover, _id, fetchPosts, isDash }) {
    const ref = useRef()
    const navigate = useNavigate()
    const tokenContext = useContext(TokenContext)
    const userContext = useContext(UserContext)

    const formatTime = (time) => {
        time = new Date(time)
        let hours = Math.abs(new Date().getTime() - time) / 36e5;
        if (hours < 1) {
            if (hours * 60 < 2) {
                return Math.trunc((hours * 60) * 60) + 's'
            }
            return Math.trunc(hours * 60) + 'min'
        } else if (hours > 24) {
            let date = (new Date(time).toDateString()).split(' ')
            return date[1] + date[2
            ]
        }
        return Math.trunc(hours) + 'h'
    }
    const deletePost = async () => {
        try {
            const result = await fetch('http://localhost:3000/posts/' + _id, {
                method: 'DELETE',
                headers: { 'authorization': 'bearer ' + tokenContext.userToken }
            })
            document.querySelector(".modal-wrapper").click()
            if (!result.ok) {
                throw new Error(await result.json())
            } else {
                fetchPosts()
            }
        } catch (error) {
            console.error('Error deleting post', error)
            throw new Error(error)
        }
    }

    const unpublishedPost = async () => {
        try {
            const result = await fetch('http://localhost:3000/posts/' + _id, {
                method: 'PUT',
                body: JSON.stringify({ isPublished: isDash ? true : false }),
                headers: { 'authorization': 'bearer ' + tokenContext.userToken, 'Content-Type': "application/json" }
            })
            document.querySelector(".modal-wrapper").click()
            if (!result.ok) {
                throw new Error(await result.json())
            } else {
                fetchPosts()
            }
        } catch (error) {
            console.error('Error deleting post', error)
            throw new Error(error)
        }
    }

    const handleDelete = async () => {
        const promise = deletePost()

        toast.promise(promise, {
            loading: 'Deleting Post',
            success: 'Post deleted',
            error: 'Error deleting Post'
        })
    }

    const handleUnpublished = () => {
        const promise = unpublishedPost()
        if (isDash) {
            toast.promise(promise, {
                loading: 'Publishing Post',
                success: 'Post published',
                error: 'Error publishing Post'
            })
        } else {
            toast.promise(promise, {
                loading: 'Unpublishing Post',
                success: 'Post Unpublished',
                error: 'Error unpublishing Post'
            })
        }
    }

    const handleClick = () => {
        if (ref.current) {
            ref.current.checked = false
        }
    }
    const handleNavigation = () => {
        navigate('/posts/' + _id)
    }

    useEffect(() => {
        window.addEventListener('click', handleClick)

        return () => window.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className="post-preview">
            <div className="post-cover" onClick={handleNavigation}>
                {cover && <img src={"http://localhost:3000/images/" + cover} alt="post-cover" />}
                {
                    userContext.isAdmin &&
                    <div className="opt-button" onClick={(e) => e.stopPropagation()}>
                        <label htmlFor={_id}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>options</title><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg>
                        </label>
                        <input type="checkbox" ref={ref} id={_id} hidden className="hidden-checkbox" />
                        <div className="hidden-menu" onClick={() => ref.current.click()}>
                            <label className="opt update" htmlFor={_id + "unpublish"}>
                                {!isDash ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye-off-outline</title><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye-outline</title><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>}
                                {!isDash ? 'Unpublish Post' : 'Publish Post'}
                            </label>
                            <label className="opt update" htmlFor={_id + "update"}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>update</title><path d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" /></svg>
                                Update Post
                            </label>
                            <label htmlFor={_id + 'delete'} className="opt delete">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete-svg</title><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" /></svg>
                                Delete Post
                            </label>

                        </div>
                        <Modal id={_id + "update"}>
                            <PostForm fetchPosts={fetchPosts} idProp={_id} formTitle={'Update Post'} fileProp={cover} titleProp={title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")} contentProp={content.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")} />
                        </Modal>
                        <Modal id={_id + 'delete'}>
                            <h1>Delete Post</h1>
                            <h2>Are you sure you want to delete this post?</h2>
                            <div className="post-info">
                                <div className="name">
                                    <strong>ID: </strong>{_id}
                                </div>
                                <div className="name">
                                    <strong>Title: </strong>{title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}
                                </div>
                                <div className="name">
                                    <strong>Creation Date: </strong>{create_date}
                                </div>
                                <img src={"http://localhost:3000/images/" + cover} alt="" />
                                <button className="delete-button" onClick={handleDelete}>
                                    Delete Post
                                </button>
                            </div>
                        </Modal>
                        <Modal id={_id + 'unpublish'}>
                            <h1>Delete Post</h1>
                            <h2>{!isDash ? 'Are you sure you want to unpublish this post?' : 'Are you sure you want to publish this post?'}</h2>
                            <div className="post-info">
                                <div className="name">
                                    <strong>ID: </strong>{_id}
                                </div>
                                <div className="name">
                                    <strong>Title: </strong>{title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}
                                </div>
                                <div className="name">
                                    <strong>Creation Date: </strong>{create_date}
                                </div>
                                <img src={"http://localhost:3000/images/" + cover} alt="" />
                                <button className="input-button" onClick={handleUnpublished}>
                                    {!isDash ? 'Unpublish Post' : 'Publish Post'}
                                </button>
                            </div>
                        </Modal>
                    </div>
                }
            </div>
            <div className="post-data" onClick={handleNavigation}>
                <h2 className="flex">
                    <div className="name">
                        {title.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}
                    </div>
                    <p>{formatTime(create_date)}</p>
                </h2>
                <div className="preview-bottom">
                    <div className="content">
                        {content.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").split('.')[0] + '. '+ content.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").split('.')[1]}.
                    </div>
                </div>
            </div>
        </div>
    )
}