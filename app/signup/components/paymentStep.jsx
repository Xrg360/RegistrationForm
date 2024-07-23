import React from 'react';

const PaymentStep = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Payment Screenshot
        </label>
        <input
          type="file"
          name="paymentScreenshot"
          accept="image/*"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default PaymentStep;
