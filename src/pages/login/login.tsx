import AuthForm from "../../components/core/auth-form"
import loginImg from "../../assets/images/login.webp"

function Login() {
    return (
        <AuthForm title="Login" description1="Welcome back" description2="Login to your account" image={loginImg} formType="login" />
    )
}

export default Login