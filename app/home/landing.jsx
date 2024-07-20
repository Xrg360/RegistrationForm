"use client"
import React from 'react';
import { useAuth } from '../providers/context';
import { useRouter } from 'next/navigation';
const Landing = () => {
  const { logout,isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/signup'); // Redirect to signup page after logout
  };

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <h1>Welcome to the Landing Page {localStorage.getItem("userfName")}</h1>
      {isAuthenticated?<button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
        Logout
      </button>:<button onClick={()=>router.push('/login')} className="bg-red-500 text-white py-2 px-4 rounded">
        Login
      </button>}

    </div>
  );
};

export default Landing;
