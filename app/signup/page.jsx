"use client";
import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/utils/firebaseConfig'; 
import app from '@/utils/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../providers/context';
import { useRouter } from 'next/navigation'; // Adjust the import based on your router location
import InitialSignup from './components/initialComp';
import AdditionalInfoForm from './components/additionalInfo';

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    branch: '',
    sem: '',
    clg: '',
    foodPref: '',
    membership: '',
    membid: '',
    phone: '',
    email: '',
    password: '',
    ieeeMember: '',
    ieeeID: '',
    paymentScreenshot: null,
    status: 'pending',
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'paymentScreenshot') {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const [user, setUser] = useState(null);
  const [step, setStep] = useState('initial');
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tickets'); // Redirect to landing page if already logged in
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignup = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      const userDocRef = doc(db, 'users', result.user.uid);
      localStorage.setItem('userId', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const fullName = result.user.displayName;
      const nameParts = fullName.split(' ');
      localStorage.setItem('userfName',nameParts[0]);
      localStorage.setItem('userlName',nameParts[nameParts.length - 1]);

      if (userDoc.exists()) {
        // User is already registered, consider it a login
        login();
        router.push('/tickets');
      } else {
        
        const fname = nameParts[0];
        const lname = nameParts[nameParts.length - 1];
        
        setFormData((prevData) => ({
          ...prevData,
          fname: fname,
          lname: lname,
          email: result.user.email,
        }));
        setStep('info');
      }
    } catch (error) {
      console.error('Error during Google sign-in', error);
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

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...formData,
        paymentScreenshot: paymentScreenshotUrl,
        uid: user.uid,
      });

      console.log('User document written with ID: ', user.uid);
      login();
      localStorage.setItem('userName', formData.name);
      router.push('/tickets');
    } catch (e) {
      console.error('Error during signup: ', e);
      alert('Error during signup. Please try again.');
    }
  };

  if (isAuthenticated) return null; 

  return (
    <div className=' md:h-screen w-full flex justify-center items-center'>
      
        {step === 'initial' ? (
          <InitialSignup 
            handleGoogleSignup={handleGoogleSignup} 
            handleEmailPasswordSignup={handleEmailPasswordSignup} 
            formData={formData}
            handleChange={handleChange}
          />
        ) : (
          <AdditionalInfoForm 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit}
            isGoogleSignUp={user?.providerData?.[0]?.providerId === 'google.com'}
          />
        )}
        {/* <AdditionalInfoForm 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit}
            isGoogleSignUp={user?.providerData?.[0]?.providerId === 'google.com'}
          /> */}
      </div>
  );
};

export default Signup;
