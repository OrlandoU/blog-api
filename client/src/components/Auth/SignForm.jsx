import { useContext, useState } from "react"
import { TokenContext } from "../../Contexts/TokenContext"
import { toast } from "react-hot-toast"

export default function SignForm() {
    const tokenObj = useContext(TokenContext)
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmation = (e) => {
        setPasswordConfirmation(e.target.value)
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await fetch('https://expressblog.fly.dev/auth/sign-up', {
                method: 'POST',
                body: JSON.stringify({ password, username, passwordConfirmation, email }),
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
            toast.error(error.message)
        }
    }
    const handleAltAuth = (e) => {
        e.preventDefault()
        document.querySelector(".modal-wrapper").click()
        document.querySelector("#login-form").click()
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <div className="inputs-container">
                <label htmlFor="">
                    Username
                    <input type="text" value={username} onInput={handleUsername} placeholder="Username..." required />
                </label>
                <label htmlFor="">
                    Email
                    <input type="text" value={email} onInput={handleEmail} placeholder="Email..." required />
                </label>
                <label htmlFor="">
                    Password
                    <input type="text" value={password} onInput={handlePassword} placeholder="Password..." required />
                </label>
                <label htmlFor="">
                    Password Confirmation
                    <input type="text" value={passwordConfirmation} onInput={handlePasswordConfirmation} placeholder="Password Confirmation..." required />
                </label>
                <button className="input-button">Submit</button>
                <div className="alt-auth">
                    Already a member? <a href="/" onClick={handleAltAuth} className="link">Sign Up</a>
                </div>
            </div>

        </form>
    )
}