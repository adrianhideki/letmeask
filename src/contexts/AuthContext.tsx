import { useState, useEffect } from "react";
import { createContext, ReactNode } from "react";
import { firebase, auth } from "../services/firebase";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthUserData = {
  name: string;
  avatar: string;
  id: string;
};

type AuthContextProps = {
  signInWithGoogle: () => Promise<void>;
  user?: AuthUserData;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUserData>();
  const provider = new firebase.auth.GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account.");
        }

        setUser({
          name: displayName,
          avatar: photoURL,
          id: uid,
        });
      }
    });

    return ()  => {
      unsubscribe();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    const result = await auth.signInWithPopup(provider);

    if (result?.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }

      setUser({
        name: displayName,
        avatar: photoURL,
        id: uid,
      });
    }
  };

  const value = {
    signInWithGoogle,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
