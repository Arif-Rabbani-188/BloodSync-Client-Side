import { useState, useEffect, use } from "react";

import { AuthContext } from "./AuthContext";
import auth from "../../../Firebase/firebase.init.js";
import Swal from "sweetalert2";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  // Avoid Router-dependent hooks here

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://blood-sync-server-side.vercel.app/users"
  //       );
  //       const currentUser = response.data.find((u) => u.email === user?.email);
  //       if (currentUser) {
  //         setUserData(currentUser);
  //       } else {
  //         setUserData(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       setUserData(null);
  //     }
  //   };

  //   if (user?.email) {
  //     fetchUserData();
  //   } else {
  //     setUserData(null);
  //   }
  // }, [user?.email]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://blood-sync-server-side.vercel.app/users/${user?.email}`
        );
        setUserData(response.data || null);
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

  const createUserWithEmail = async (email, password, photoURL, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, {
      displayName: name,
      photoURL: photoURL,
    });
    setUser(result.user);
  };

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    // No need to reload the page; state update will trigger re-render
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;
      setUser(gUser);

      const email = gUser?.email?.toLowerCase();
      try {
        const check = await axios.get(
          `https://blood-sync-server-side.vercel.app/users/${email}`
        );
        const exists = !!(check?.data && check.data.email);
        if (exists) {
          const storedPhoto = check.data.photoURL;
          const googlePhoto = gUser?.photoURL;
          if (googlePhoto && googlePhoto !== storedPhoto) {
            try {
              // Use Firebase ID token manually since we can't use useNavigate here
              const token = await gUser.getIdToken();
              await axios.patch(
                `https://blood-sync-server-side.vercel.app/users/${email}`,
                { photoURL: googlePhoto },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (updateErr) {
              // Silently ignore if endpoint doesn't exist or fails; login continues
              console.warn("Photo sync skipped:", updateErr?.response?.status || updateErr?.message);
            }
          }
        }
        return { user: gUser, needsProfile: !exists };
      } catch (_err) {
        // Treat as new user when not found
        return { user: gUser, needsProfile: true };
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUserWithEmail,
    signInWithEmail,
  signInWithGoogle,
    logOut: async () => {
      setLoading(true);
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
