import { useContext } from "react";
import  { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/firebase.config";

const Login = () => {
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user); // ✅ Fix: Update user state
            navigate(location.state?.from || "/");
            console.log("User signed in successfully: ", result.user);
        } catch (error) {
            console.error("Error signing in with Google: ", error.message);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen">
             <button onClick={loginWithGoogle} className="p-3 bg-blue-500 text-white rounded">
                Sign in with Google
             </button>
        </div>
    );
};

export default Login;