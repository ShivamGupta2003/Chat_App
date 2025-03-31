import { createContext, useEffect, useState, useContext } from "react";
import {
  updateDoc, // Make sure this is imported
} from "firebase/firestore";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
export const AuthContext = createContext();
import { db } from "../firebaseConfig";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setIsAuthenticated(true);
  //       setUser(user);
  //       updateUserData(user.uid);
  //     } else {
  //       setIsAuthenticated(false);
  //       setUser(null);
  //     }
  //   });
  //   return unsub;
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          setUser(user);
          updateUserData(user.uid);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      });

      return () => unsub();
    }, 2000); // 4-second delay

    return () => clearTimeout(timer);
  }, []);

  const updateUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser((user) => ({
          ...user,
          username: userData.username,
          profileUrl: userData.profileUrl,
          userId: userData.userId,
        }));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUser = async (newData) => {
    try {
      // Update Firebase Auth profile
      if (newData.displayName) {
        await updateAuthProfile(auth.currentUser, {
          displayName: newData.displayName,
        });
      }

      // Update Firestore - make sure to use the correct document reference
      if (newData.username) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          username: newData.username,
        });
      }

      // Update local state
      setUser((prev) => ({
        ...prev,
        displayName: newData.displayName || prev.displayName,
        username: newData.username || prev.username,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };
  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      let errorMessage;

      switch (e.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        default:
          errorMessage = "Email or Password is incorrect.";
          break;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", response.user.uid), {
        username,
        profileUrl,
        userId: response.user.uid,
      });

      return { success: true, data: response?.user?.uid };
    } catch (e) {
      let errorMessage;

      switch (e.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        default:
          errorMessage = "Some data is Wrong filled ";
          break;
      }

      console.error("Error during registration:", e.message);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email) => {
    try {
      console.log(email);
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e) {
      let errorMessage;

      switch (e.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        default:
          console.log(e);
          errorMessage = "Failed to send password reset email.";
          break;
      }

      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        updateUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};
