import AuthForm from "../../components/core/auth-form.tsx"
import registerImg from "../../assets/images/register.webp"

const Register = () => {


    return (
        <AuthForm title="Join worlds best quran learning platform" description1={'Build skills for today, tomorrow, and beyond.'} description2="Education to future-proof your career." image={registerImg} formType="signup" />
    )
}
export default Register