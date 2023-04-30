import { useContext, useState } from "react"
import { TokenContext } from "../../Contexts/TokenContext"
import { toast } from "react-hot-toast"

export default function LoginForm() {
    const tokenObj = useContext(TokenContext)
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await fetch('https://expressblog.fly.dev/auth/login', {
                method: 'POST',
                body: JSON.stringify({ password, username }),
                headers: { 'Content-Type': "application/json" }
            })
            const data = await result.json()
            if (result.ok) {
                document.querySelector(".modal-wrapper").click()
                tokenObj.setUserToken(data.token)
                toast.success('Logged')

            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Error getting token', error)
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleAltAuth = (e) => {
        e.preventDefault()
        document.querySelector(".modal-wrapper").click()
        document.querySelector("#sign-form").click()
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="inputs-container">
                <label htmlFor="">
                    Username
                    <input type="text" value={username} onInput={handleUsername} placeholder="Username..." required />
                </label>
                <label htmlFor="">
                    Password
                    <input type="text" value={password} onInput={handlePassword} placeholder="Password..." required />
                </label>
                <button className="input-button">Submit</button>
                <div className="alt-auth">
                    Not a member? <a href="/" onClick={handleAltAuth} className="link">Sign Up</a>
                </div>
            </div>

        </form>
    )
}