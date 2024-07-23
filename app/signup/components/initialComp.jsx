"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import {useRouter} from "next/navigation";
import React from "react";
import Image from "next/image";

const InitialSignup = ({
  handleGoogleSignup,
  handleEmailPasswordSignup,
  formData,
  handleChange,
}) => {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto px-6 py-2 pb-10 bg-white flex justify-center items-center flex-col  md:w-1/2 rounded-lg mt-10">
        <Image src={'/assets/logo.png'} height={100} width={100} className='py-2'></Image>
        <h2 className="text-2xl font-bold mb-6 text-center font-grifter">Signup for Summit</h2>
      <button
        onClick={handleGoogleSignup}
        className="md:w-3/5 bg-primary/80 text-black py-2 px-4 rounded mb-6 flex justify-center items-center hover:bg-primary/40"
      >
        <Image src='/assets/google.svg' height={20} width={20} className='py-1'></Image>
        <p className="px-4 font-semibold transition duration-300 ease-out    ">Sign up with Google</p>
      </button>
      <form className="md:w-3/5" onSubmit={handleEmailPasswordSignup}>
        <div className="mb-4">
          <label className="block text-gray-700">Email*</label>
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
          <label className="block text-gray-700">Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>
        <div className='flex justify-center p-2 '>
            <button type="submit" className="relative px-6 py-3 font-bold text-black group">
              <span className="absolute inset-0 rounded-xl w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-primary group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full rounded-xl border-2 border-black"></span>
              <span className="relative">Sign up</span>
            </button>

            </div>
      </form>
      <p className="py-2">
        Have an account?
        <button
          onClick={() => router.push("/login")}
          className=" text-blue-600  rounded px-1  hover:underline transition-all duration-300"
        >
          Login
        </button>
      </p>
    <div/>
    </div>
  );
};

export default InitialSignup;
