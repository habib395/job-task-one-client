import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/firebase.config";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3 md:w-1/4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue to your task board.
        </p>
        <button
          onClick={loginWithGoogle}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
