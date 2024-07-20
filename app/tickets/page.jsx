"use client"
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Import getFirestore and getDoc
import app from "@/utils/firebaseConfig";

const Page = () => {
  const [userDetails, setUserDetails] = useState(null);
  const db = getFirestore(app); // Initialize Firestore
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now fetch additional user details from Firestore
        const userId = localStorage.getItem('userId'); 
        if (userId) {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            // Combine auth user details with Firestore user details
            const firestoreDetails = userDocSnap.data();
            setUserDetails({
              uid: user.uid,
              email: user.email,
              ...firestoreDetails, // Spread Firestore details (branch, sem, etc.)
            });
          } else {
            console.log("No such document in Firestore!");
          }
        }
      } else {
        // User is signed out
        setUserDetails(null);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    // Set a timeout to change the isLoading state after 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Cleanup the timer if the component unmounts before the timer finishes
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {userDetails ? (
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <p>User ID: {userDetails.uid}</p>
          <p>Email: {userDetails.email}</p>
          <p>Name: {userDetails.fname}{userDetails.lname}</p>
          <p>Branch: {userDetails.branch}</p>
          <p>Semester: {userDetails.sem}</p>
          <p>Food Preference: {userDetails.foodPref}</p>
          <p>Phone: {userDetails.phone}</p>
        </div>
      ) : (
        <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>No user is currently signed in.</p>
      )}
    </div>
      )}
    </div>
  );
};

export default Page;
