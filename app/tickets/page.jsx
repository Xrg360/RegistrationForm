"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Import getFirestore and getDoc
import app from "@/utils/firebaseConfig";
import { useAuth } from "../providers/context";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  faLocationDot,
  faLocationPin,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "next/navigation";
import QRCode from "qrcode.react";

const Page = () => {
  const [userDetails, setUserDetails] = useState(null);
  const db = getFirestore(app); // Initialize Firestore
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now fetch additional user details from Firestore
        const userId = localStorage.getItem("userId");
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDivClick = () => {
    if (isExpanded) {
      logout();
      router.push("/");
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div>
      {userDetails ? (
        <div className="h-screen w-full">
          <div className="bg-primary/5   w-full h-10 top-0 left-0 p-10 flex justify-between">
            <span className=" text-left font-grifter text-xl text-primary " onClick={()=>{router.push('/')}}>
              {" "}
              {"< "}Back to Homepage
            </span>
            <div
              className={`group h-12 w-12 border-2 border-primary rounded-full flex justify-center items-center ${
                isExpanded ? "w-32" : "w-12"
              } transition-all duration-300 ease-in-out cursor-pointer`}
              onClick={handleDivClick}
            >
              <span
                className={`font-grifter text-xl ${
                  isExpanded ? "hidden" : "block"
                }`}
              >
                <FontAwesomeIcon icon={faRightFromBracket}/>
              </span>
              <span
                className={`font-grifter text-md ${
                  isExpanded ? "block" : "hidden"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from triggering the div's onClick
                  logout();
                  router.push("/");
                }}
              >
                Logout
                <FontAwesomeIcon className="px-2" icon={faRightFromBracket} />
              </span>
            </div>
          </div>
          <div className="md:h-[88%] overflow-auto w-full flex flex-grow flex-col justify-center items-center pb-20 md:pb-0 bg-primary/5">
            <div className="shadow-lg md:h-[60%]  mt-10 md:mt-0 w-4/5 bg-primary/10 flex-col md:flex-row rounded-lg flex justify-center items-center">
              <div className="md:w-1/4 md:border-r-2 border-b-2 md:border-b-0 p-10 md:p-0 border-dashed border-black flex-col h-full flex justify-center items-center relative ">
                <QRCode
                  value={userDetails.email}
                  size={150} // Adjust size as needed
                  bgColor="#FAA41A00" // Background color
                  fgColor="#000000" // Foreground color
                  level="Q" // Error correction level: L, M, Q, H
                  includeMargin={true}
                />
                <p className="font-mono text-sm">DEV SUMMIT&lsquo;24</p>
                <div className="rounded-tl-full h-10 w-10 bg-white right-0 bottom-0 md:block absolute hidden "></div>
                <div className="rounded-bl-full h-10 w-10 bg-white right-0 top-0 md:block absolute hidden"></div>
              </div>
              <div className="w-full h-full relative">
                <div className="rounded-tl-full h-10 w-10 bg-white right-0 bottom-0 md:block absolute hidden"></div>
                <div className="rounded-bl-full h-10 w-10 bg-white right-0 top-0 md:block absolute hidden"></div>
                <div className="rounded-tr-full h-10 w-10 bg-white left-0 bottom-0 md:block absolute hidden"></div>
                <div className="rounded-br-full h-10 w-10 bg-white left-0 top-0 md:block absolute hidden"></div>
                <div className="w-full h-1/5 flex justify-center items-center">
                  <p className="font-grifter text-2xl py-2 md:py-0">
                    Ticket Details
                  </p>
                </div>
                <div className="flex flex-col p-10 justify-center h-4/5">
                  <div className="flex md:flex-row flex-col text-center justify-between md:items-center">
                    <p className="font-grifter text-lg ">Name</p>
                    <p className="font-mono text-lg">
                      {userDetails.fname} {userDetails.lname}
                    </p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Branch</p>
                    <p className="font-mono text-lg">{userDetails.branch}</p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Semester</p>
                    <p className="font-mono text-lg">{userDetails.sem}</p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Food Preference</p>
                    <p className="font-mono text-lg">{userDetails.foodPref}</p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Phone</p>
                    <p className="font-mono text-lg">+91 {userDetails.phone}</p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Venue</p>
                    <a
                      href="https://www.google.com/maps/place/Muthoot+Institute+of+Technology+and+Science,+Varikoli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex md:flex-row flex-col text-center items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faLocationDot} />
                      <p className="font-mono text-lg">
                        Muthoot Institute of Technology and Science, Varikoli
                      </p>
                    </a>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Dates</p>
                    <p className="font-mono text-lg">
                      9th August, 10th Au`gust
                    </p>
                  </div>
                  <div className="flex md:flex-row flex-col text-center justify-between items-center">
                    <p className="font-grifter text-lg">Time</p>
                    <p className="font-mono text-lg">9:00 a.m to 5:00 p.m.</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 md:border-l-2 border-t-2 md:border-t-0 border-black w-4/5 p-10 h-full border-dashed relative flex md:justify-end flex-col items-center">
                <div className="rounded-tr-full h-10 w-10 bg-white left-0 bottom-0 md:block absolute hidden"></div>
                <div className="rounded-br-full h-10 w-10 bg-white left-0 top-0 md:block absolute hidden"></div>
                <p className="font-grifter text-xl py-6">Rs. 799/-</p>
                <div
                  className={`h-1/5 w-full capitalize ${
                    userDetails.status == "pending"
                      ? "bg-primary"
                      : userDetails.status == "rejected"
                      ? "bg-red-600"
                      : "bg-green-400"
                  } rounded-lg flex justify-center items-center font-extrabold font-grifter py-2 px-4 text-green-950`}
                >
                  {" "}
                  {userDetails.status}{" "}
                </div>
              </div>
            </div>
          </div>
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
