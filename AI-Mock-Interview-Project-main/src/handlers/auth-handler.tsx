import { db } from "@/config/firebase.config";
import LoaderPage from "@/routes/LoaderPage";
import { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * AuthHandler Component
 * 
 * This component checks if a signed-in user's data exists in Firestore.
 * If not, it creates a new user document using Clerk user info.
 * It runs silently in the background and shows a loader while processing.
 * No UI is rendered after the task is complete.
 */

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          const userSnap = await getDoc(doc(db, "users", user.id));
          if (!userSnap.exists()) {
            const userData: User = {
              id: user.id,
              name: user.fullName || user.firstName || "Anonymous",
              email: user.primaryEmailAddress?.emailAddress || "N/A",
              imageUrl: user.imageUrl,
              createdAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", user.id), userData);
          }
        } catch (error) {
          console.log("Error while storing thr User data :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }

  return null;
};

export default AuthHandler;
