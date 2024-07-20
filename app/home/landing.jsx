"use client";
import React from 'react';
import { useAuth } from '../providers/context';
import { useRouter } from 'next/navigation';

const Landing = () => {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/signup'); // Redirect to signup page after logout
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className='h-screen overflow-auto w-full flex flex-col items-center p-6'>
      <header className='w-full flex justify-between items-center py-4 bg-white '>
        <h1 className='text-2xl font-bold text-primary'>Dev Summit 2024</h1>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
            Logout
          </button>
        ) : (
          <div className='flex space-x-4'>
            <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded">
              Login
            </button>
            <button onClick={handleSignup} className="bg-green-500 text-white py-2 px-4 rounded">
              Signup
            </button>
          </div>
        )}
      </header>
      <main className='flex-1 flex flex-col justify-center items-center text-center space-y-8'>
        <h2 className='text-3xl font-bold text-primary'>Welcome to the Dev Summit 2024 Registration Page</h2>
        <p className='text-xl'>Hello {localStorage.getItem("userfName")}, get ready for an amazing experience!</p>
        <div className='flex justify-between md:flex-row flex-col'>
        <section className='w-full max-w-3xl bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-2xl font-semibold mb-4'>Event Instructions</h3>
          <p className='text-lg mb-4'>
            Join us for a two-day event filled with insightful sessions, networking opportunities, and hands-on workshops.
          </p>
          <ul className='list-disc list-inside text-left space-y-2'>
            <li>Dates: 9th and 10th August</li>
            <li>Time: 9:00 AM to 5:00 PM</li>
            <li>Venue: Muthoot Institute of Technology and Science, Varikoli</li>
            <li>Food preferences will be accommodated</li>
            <li>Don't forget to bring your ID and the QR code provided after registration</li>
          </ul>
        </section>

        <section className='w-full max-w-3xl bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-2xl font-semibold mb-4'>Signup Instructions</h3>
          <p className='text-lg mb-4'>
            New here? Follow these steps to sign up and join the event:
          </p>
          <ol className='list-decimal list-inside text-left space-y-2'>
            <li>Click on the Signup button</li>
            <li>Fill out the registration form with your details</li>
            <li>Confirm your email address</li>
            <li>Receive your event ticket with a unique QR code</li>
          </ol>
        </section>
        </div>
       
      </main>
    </div>
  );
};

export default Landing;
