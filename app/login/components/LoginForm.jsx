import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/context";
import app from "@/utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        login();
        localStorage.setItem("userEmail", userCredential.user.email);
      
        // Correctly fetch the document data
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
      
        if (docSnap.exists()) {
          localStorage.setItem("userName", docSnap.data().name);
        } else {
          console.log("No such document!");
        }
      
        router.push("/");
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
      localStorage.setItem("userEmail", result.user.email);
      localStorage.setItem("userName", result.user.displayName);
      login();
      router.push("/");
    } catch (error) {
      console.error("Google Authentication Error:", error.message);
      alert("Google authentication failed.");
    }
  };

  return (
    <div className="flex items-start justify-center min-h-[73vh]">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-lg overflow-hidden">
        <div className="w-full p-8">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Login
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow appearance-none border-2 ${
                  formErrors.email ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700" : "border-gray-300"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Oops!</span> {formErrors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`shadow appearance-none border-2 ${
                    formErrors.password ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Oops!</span> {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
