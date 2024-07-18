"use client"
import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, db, storage } from '@/utils/firebaseConfig'; // Import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/app/providers/context'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import the useRouter hook from Next.js

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    sem: '',
    clg: '',
    foodPref: '',
    phone: '',
    email: '',
    password: '',
    paymentScreenshot: null,
  });

  const [user, setUser] = useState(null);
  const [step, setStep] = useState('initial'); // 'initial' or 'info'
  const { login,isAuthenticated } = useAuth(); // Destructure login from the useAuth hook
  const router = useRouter(); // Initialize useRouter
  console.log(isAuthenticated)
  const handleGoogleSignup = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setFormData((prevData) => ({ ...prevData, email: result.user.email }));
      setStep('info');
    } catch (error) {
      console.error('Error during Google sign-in', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'paymentScreenshot') {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleEmailPasswordSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setUser(userCredential.user);
      setStep('info');
    } catch (e) {
      console.error('Error during signup: ', e);
      alert('Error during signup. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let paymentScreenshotUrl = '';
      if (formData.paymentScreenshot) {
        const storageRef = ref(storage, `paymentScreenshots/${formData.paymentScreenshot.name}`);
        await uploadBytes(storageRef, formData.paymentScreenshot);
        paymentScreenshotUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, 'signups'), {
        ...formData,
        paymentScreenshot: paymentScreenshotUrl,
        uid: user.uid,
      });

      console.log('Document written with ID: ', docRef.id);
      login(); // Set the authentication context
      localStorage.setItem('userName', formData.name); // Save the user's name in local storage
      router.push('/'); // Redirect to the homepage
    } catch (e) {
      console.error('Error during signup: ', e);
      alert('Error during signup. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Signup for Techfest</h2>
      {step === 'initial' ? (
        <>
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-red-500 text-white py-2 px-4 rounded mb-6 hover:bg-red-600"
          >
            Sign up with Google
          </button>
          <form onSubmit={handleEmailPasswordSignup}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
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
              <label className="block text-gray-700">Password</label>
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
              Sign up
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Semester</label>
            <input
              type="text"
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">College</label>
            <input
              type="text"
              name="clg"
              value={formData.clg}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Food Preference</label>
            <select
              name="foodPref"
              value={formData.foodPref}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            >
              <option value="" disabled>Select preference</option>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Screenshot</label>
            <input
              type="file"
              name="paymentScreenshot"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
