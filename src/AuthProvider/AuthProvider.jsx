import { 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ routes }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate()


    const handleLogin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const handleLogOut = async () => {
        return await signOut(auth); // ✅ Fix: Properly await signOut
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); // ✅ Fix: Proper cleanup
    }, []);

    const authInfo = {
        handleLogin,
        handleLogOut,
        user,
        setUser,
        loading,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {routes}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
