import React from 'react';

const InitialSignup = ({ handleGoogleSignup, handleEmailPasswordSignup, formData, handleChange }) => (
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
);

export default InitialSignup;
