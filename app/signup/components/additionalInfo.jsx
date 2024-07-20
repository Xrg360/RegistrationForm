import React from 'react';

const AdditionalInfoForm = ({ formData, handleChange, handleSubmit, isGoogleSignUp }) => (
  <form onSubmit={handleSubmit}>
    {!isGoogleSignUp && (
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
    )}
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
      <label className="block text-gray-700">Phone</label>
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
      className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Submit
    </button>
  </form>
);

export default AdditionalInfoForm;
