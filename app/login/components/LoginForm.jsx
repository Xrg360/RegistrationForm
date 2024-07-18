import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import app from "@/utils/firebaseConfig";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/context";

gsap.registerPlugin(ScrollTrigger);

const LoginForm = () => {
  const formRef = useRef(null);
  const { login } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    let error = "";
    let success = "";

    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!isValidEmail(value)) {
        error = "Email is not valid";
      } else {
        success = "Email is valid!";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else {
        success = "Password looks good";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setFormSuccess((prevSuccess) => ({
      ...prevSuccess,
      [name]: success,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    const errors = {};
    const success = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Email is not valid";
    } else {
      success.email = "Email is valid!";
    }

    if (!password) {
      errors.password = "Password is required";
    } else {
      success.password = "Password looks good";
    }

    setFormErrors(errors);
    setFormSuccess(success);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reset play reset",
        },
      }
    );
  }, []);

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
        const userEmail = userCredential.user.email;
        console.log(userEmail)
        if (userEmail === "test@gmail.com") {
          router.push("/registernow");
        } else {
          localStorage.setItem("userEmail", userEmail);
          router.push("/admin");
        }
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
    validateField(name, value);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      console.log(userEmail)
      if (userEmail === "test@gmail.com") {
        router.push("/registernow");
      } else {
        localStorage.setItem("userEmail", userEmail);
        router.push("/tickets");
      }
    } catch (error) {
      console.error("Google Authentication Error:", error.message);
      alert("Google authentication failed.");
    }
  };

  return (
    <div className="flex items-start justify-center min-h-[73vh] ">
      <div className="flex flex-col md:flex-row w-full max-w-4xl  rounded-lg overflow-hidden ">
        <div className="w-full p-8" ref={formRef}>
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Contact Me
            </h2>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow appearance-none border-2 ${
                  formErrors.email
                    ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700"
                    : formSuccess.email
                    ? "border-green-500 bg-green-50 text-green-900 placeholder-green-700"
                    : "border-gray-300"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              />
              {formErrors.email && !formSuccess.email && (
                <p className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Oops!</span> {formErrors.email}
                </p>
              )}
              {!formErrors.email && formSuccess.email && (
                <p className="mt-2 text-sm text-green-600">
                  <span className="font-medium">Alright!</span>{" "}
                  {formSuccess.email}
                </p>
              )}
            </div>

            {/* Password input field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
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
                    formErrors.password
                      ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700"
                      : formSuccess.password
                      ? "border-green-500 bg-green-50 text-green-900 placeholder-green-700"
                      : "border-gray-300"
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
              {formErrors.password && !formSuccess.password && (
                <p className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Oops!</span>{" "}
                  {formErrors.password}
                </p>
              )}
              {!formErrors.password && formSuccess.password && (
                <p className="mt-2 text-sm text-green-600">
                  <span className="font-medium">Alright!</span>{" "}
                  {formSuccess.password}
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
