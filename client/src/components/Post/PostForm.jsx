import { useContext, useState } from "react"
import { TokenContext } from "../../Contexts/TokenContext"
import toast from 'react-hot-toast'
import {  useNavigate } from "react-router"


export default function PostForm({ formTitle, contentProp, fileProp, titleProp, idProp, fetchPosts }) {
    const tokenContext = useContext(TokenContext)
    const navigate = useNavigate()
    const [file, setFile] = useState(fileProp || 'none')
    const [content, setContent] = useState(contentProp || '')
    const [title, setTitle] = useState(titleProp || '')

    const handleContent = (e) => {
        setContent(e.target.value)
    }
    console.log(file)

    const handleTitle = (e) => {
        setTitle(e.target.value)
        // Create toasts anywhere
    }

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const removeFile = () => {
        setFile('none')
    }

    const createPost = async () => {
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            formData.append('cover', file)
            const result = await fetch('https://expressblog.fly.dev/posts', {
                method: 'POST',
                body: formData,
                headers: {
                    'authorization': 'bearer ' + tokenContext.userToken
                }
            })
            const data = await result.json()
            setContent('')
            setTitle('')
            setFile(null)
            document.querySelector(".modal-wrapper").click()
            if (!result.ok) {
                throw new Error(data)
            }
        } catch (error) {
            console.error('Error creating post', error)
            throw new Error(error || 'Error creating post');
        }
    }

    const updatePost = async () => {
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            formData.append('cover', file)
            console.log(file)

            const result = await fetch('https://expressblog.fly.dev/posts/' + idProp, {
                method: 'PUT',
                body: formData,
                headers: {
                    'authorization': 'bearer ' + tokenContext.userToken
                }
            })
            const data = await result.json()
            document.querySelector(".modal-wrapper").click()
            document.body.click()
            setContent('')
            setTitle('')
            setFile(null)
            if (!result.ok) {
                throw new Error(data)
            }
            if (fetchPosts) {
                fetchPosts()
            } else {
                window.location.reload(true)
            }
        } catch (error) {
            console.error('Error creating post', error)
            throw new Error(error || 'Error creating post');
        }
    }

    const handleSubmit = (e) => {
        console.log('ok')
        e.preventDefault()
        const promise = formTitle[0] !== 'U' ? createPost() : updatePost()
        promise.then(() => {
            navigate('/')
        })

        toast.promise(promise, {
            loading: formTitle[0] !== 'U' ? 'Creating Post' : 'Updating Post',
            success: formTitle[0] !== 'U' ? 'Post Created' : 'Post Updated',
            error: formTitle[0] !== 'U' ? 'Error creating Post' : 'Error updating Post',
        })
    }

    return (
        <form onSubmit={handleSubmit} onClick={(e) => { e.stopPropagation() }}>
            <h1>{formTitle}</h1>
            <div className="inputs-container">
                <label htmlFor="">
                    Post Title
                    <input type="text" value={title} onInput={handleTitle} placeholder="Title..." required />
                </label>
                <label htmlFor="">
                    Post Content
                    <textarea rows={10} type="text" value={content} onInput={handleContent} placeholder="Content..." required />
                </label>
                <label htmlFor="">
                    Post Cover
                    {(typeof file == 'string' && file === 'none') && <input type="file" name="cover" onChange={handleFile} />}
                    {(typeof file !== 'string' || file !== 'none') && <div className="img-container">
                        <span onClick={removeFile}><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></span>
                        <img src={typeof file == 'string' ? "https://expressblog.fly.dev/images/" + file : URL.createObjectURL(file)} alt="post cover" />
                    </div>}
                </label>
                <button className="input-button">{formTitle}</button>
            </div>
        </form>
    )
}