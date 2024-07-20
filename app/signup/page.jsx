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
    membership: '',
    membid: '',
    phone: '',
    email: '',
    password: '',
    paymentScreenshot: null,
  });

  const [user, setUser] = useState(null);
  const [step, setStep] = useState('initial'); // 'initial' or 'info'
  const { login, isAuthenticated } = useAuth(); // Destructure login from the useAuth hook
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
    <div className='flex justify-center  md:w-full md:h-screen h-fit w-fit'>
      <div className="md:p-4 md:flex-row  flex flex-col  h-fit ">


        <div className='md:w-1/4 p-3 md:border-r-4 md:border-gray-950 '>

        <img src="./assests/ieee.png" alt="logo" className='w-12 h-5' />
        <h2 className="text-5xl font-extrabold font-grifter  text-left">DevSummit <br />2024</h2>
        <h2 className="text-2xl text-devcolor font-medium  font-grifter  text-left">Event Registration</h2>
        <div className='  font-medium'>

          <div className='flex gap-2 '>
            <img src="/assests/location.svg" className='w-4' />
            <text className='text-8sm font-grifter  '>MITS Campus</text>
          </div>
          <div className='flex gap-2  '>
            <img src="/assests/date.svg" className='w-4' />
            <text className='text-8sm font-grifter  '>09/08/2024 & 10/08/2024</text>
          </div>
          <text className='flex py-4 text-5sm font-grifter font-semibold'>Interactive hands-on workshop that encourages students from all backgrounds, to imagine innovate and create. This event hosts a platform for mentors to share their knowledge and for learners to improve their skill sets through various hands-on sessions and lectures related to the upcoming trends in our tech industry which would help them understand the jobs being done in the current industry.</text>
        </div>
        </div>



        <div className='flex flex-col p-4 justify-center   mx-auto'>
        {step !== 'initial' ? (
          <div className='border flex flex-col p-4 '>
            <button
              onClick={handleGoogleSignup}
              className="border border-amber-500 bg-sky-50 hover:bg-amber-100 rounded text-amber-500 p-2 font-bold flex flex-row gap-3 justify-center"
            >
              Sign up with Google
            </button>
            <span class="text-center text-sm font-bold  text-sky-500 opacity-50">or</span>
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
              <div className='flex justify-center '>
            <a href="/" class="relative px-6 py-3 font-bold text-black group">
              <span class="absolute inset-0 rounded-xl w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-devcolor group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span class="absolute inset-0 w-full h-full rounded-xl border-2 border-black"></span>
              <span class="relative">Proceed to Pay</span>
            </a>

            </div>
            </form>
          </div>
        ) : (

          <form onSubmit={handleSubmit} className=';'>
            
               <h2 className="text-4xl text-devcolor font-bold font-grifter  text-left">Event Registration<br/> Form</h2>
            <div className='md:flex md:justify-evenly md:gap-20 '>
            <div className="">
            <div className="mb-4 ">
              <label className="block font-grifter  text-gray-700">Name</label>
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
              <div className='flex gap-3'>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="veg"
                  name="foodPref"
                  value="veg"
                  checked={formData.foodPref === 'veg'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="veg" className="ml-2 text-sm font-medium">Veg</label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="nonveg"
                  name="foodPref"
                  value="nonveg"
                  checked={formData.foodPref === 'nonveg'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="nonveg" className="ml-2 text-sm font-medium">Non-Veg</label>
              </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Are you an IEEE member?</label>
              <div className='flex gap-3'>
              <div className="flex items-center  mt-2">
                <input
                  type="radio"
                  id="yes"
                  name="membership"
                  value="yes"
                  checked={formData.membership === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="yes" className="ml-2 text-sm font-medium">Yes</label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="no"
                  name="membership"
                  value="no"
                  checked={formData.membership === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="no" className="ml-2 text-sm font-medium">No</label>
              </div>
              </div>
            </div>
            {formData.membership === 'yes' && (
              <div className="mb-4">
                <label className="block text-gray-700">Membership ID</label>
                <input
                  type="text"
                  name="membid"
                  value={formData.membid}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                  required
                />
              </div>
            )}
            
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
            </div>
            <div className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
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
                </div>
            </div>
            <div className='flex justify-center p-2 '>
            <a href="/" class="relative px-6 py-3 font-bold text-black group">
              <span class="absolute inset-0 rounded-xl w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-devcolor group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span class="absolute inset-0 w-full h-full rounded-xl border-2 border-black"></span>
              <span class="relative">Proceed to Pay</span>
            </a>

            </div>
            <text className='flex justify-center p-1 text-xs font-thin'>
            <img src="/assests/Copyright.svg" className='w-4' />
            Copyright IEEE SB MITS</text>
            <img src="/assests/devsummit.svg" className='w-16 mx-auto' />
          </form>
        )}
      </div>
      </div>
    </div>
  );
};

export default Signup;
