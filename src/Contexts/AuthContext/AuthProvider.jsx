import { useState, useEffect, use } from "react";

import { AuthContext } from "./AuthContext";
import auth from "../../../Firebase/firebase.init.js";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const currentUser = response.data.find((u) => u.email === user?.email);

        console.log("Current User Data:", response.data);
        console.log("Current User:", user?.email);
        console.log("Found User:", currentUser);
        if (currentUser) {
          setUserData(currentUser);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    if (user?.email) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [user?.email]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const createUserWithEmail = async (email, password, photoURL, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, {
      displayName: name,
      photoURL: photoURL,
    });
    setUser(result.user);
    
  };

  const signInWithEmail = async (email, password) => {
 
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    // No need to reload the page; state update will trigger re-render
  };

  const userInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUserWithEmail,
    signInWithEmail,
    logOut: async () => {
      const result_1 = await auth.signOut();
      Swal.fire({
        title: "Logout Successful",
        icon: "success",
        draggable: false,
      });
      setUser(null);
      setUserData(null);
    },
    userData,
  };

  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
