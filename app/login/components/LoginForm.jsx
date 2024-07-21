import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/context";
import app from "@/utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Email is not valid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { email, password } = formData;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        login();
        localStorage.setItem("userId", userCredential.user.uid);
        localStorage.setItem("userEmail", userCredential.user.email);

        // Correctly fetch the document data
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          localStorage.setItem("userName", docSnap.data().name);
        } else {
          console.log("No such document!");
        }
        console.log(userCredential.user.email);
        if(userCredential.user.email === "rohitbabugeorge@gmail.com")
          router.push("/admin");
        else
          router.push("/tickets");
      } catch (error) {
        console.error("Authentication Error:", error.message);
        alert("Authentication failed. Please check your credentials.");
      }
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      localStorage.setItem("userId", result.user.uid);
      localStorage.setItem("userEmail", result.user.email);
      const nameParts = result.user.displayName.split(" ");
      localStorage.setItem("userfName", nameParts[0]);
      localStorage.setItem("userlName", nameParts[nameParts.length - 1]);
      
      login();
      console.log(result.user.email);
      if(result.user.email === "rohitbabugeorge@gmail.com")
        router.push("/admin");
      else
        router.push("/tickets");
    } catch (error) {
      console.error("Google Authentication Error:", error.message);
      alert("Google authentication failed.");
    }
  };

  return (
    <div className="h-[80vh] md:h-screen w-full flex justify-center items-center">
      <div className="max-w-md mx-auto px-6 py-2 pb-10 bg-white flex justify-center items-center flex-col md:shadow-md md:w-1/2 rounded-lg mt-10">
        <Image
          src={"/assets/logo.png"}
          height={100}
          width={100}
          className="py-2"
        ></Image>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login for Summit
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="md:w-3/5 bg-primary/80 text-black py-2 px-4 rounded mb-6 flex justify-center items-center hover:bg-primary/40"
        >
          <Image src='/assets/google.svg' height={20} width={20} className='py-1'></Image>
          <p className="px-4 font-semibold">Login with Google</p>
        </button>
        <form className="md:w-3/5" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Email<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Password<span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Log In
          </button>
          <p className="py-2">
            Dont have an account?
            <button
              onClick={() => router.push("/signup")}
              className=" text-blue-600  rounded"
            >
              Signup
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
