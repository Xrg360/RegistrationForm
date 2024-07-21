import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMap, faMapMarker } from "@fortawesome/free-solid-svg-icons";

const AdditionalInfoForm = ({
  formData,
  handleChange,
  handleSubmit,
  isGoogleSignUp,
}) => (
  <div className="w-screen md:h-screen   p-4 sm:p-10 flex flex-col lg:flex-row justify-center items-center">
    <div className="w-full lg:w-1/3 h-full p-4 sm:p-10 flex flex-col justify-center border-r-2 border-primary/40 ">
    <div className="flex justify-center items-center">
      <Image src="/assets/logo.png" height={150} width={150} alt="Logo" className="mb-2" />
      <span className="pr-8">x</span>
      <Image src="/assets/summitlogo.png" height={100} width={100} alt="Logo" className="mb-2" />
      </div>
      <h1 className="text-4xl font-bold mb-2  font-grifter">DevSummit 2024</h1>
      <h2 className="text-xl text-yellow-500 mb-4 ">Event Registration</h2>
      <p className="text-gray-700 mb-4 ">
      <FontAwesomeIcon icon={faMapMarker} className="pr-2"/>
       MITS Campus
      </p>
      <p className="text-gray-700 mb-4 ">
      <FontAwesomeIcon icon={faCalendar} className="pr-2"/>
        09/08/2024 & 10/08/2024
      </p>
      <p className="text-gray-700 ">
        Interactive hands-on workshop that encourages students from all backgrounds to imagine, innovate, and create. This event hosts a platform for mentors to share their knowledge and for learners to improve their skill sets through various hands-on sessions and lectures related to the upcoming trends in our tech industry which would help them understand the jobs being done in the current industry.
      </p>
    </div>
    <div className="w-full lg:w-2/3 h-ful p-4 sm:p-10 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-yellow-500 mb-6 ">
        Event Registration Form
      </h2>
      <form className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4  transition-all duration-500 ease-out" onSubmit={handleSubmit}>
       
          <>
            <div className="col-span-1">
              <label className="block text-gray-700">
                First Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700">
                Last Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
          </>
       
        <div className="col-span-1">
          <label className="block text-gray-700">
            Phone No.<span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border  rounded mt-2"
            pattern="[0-9]*"
            required
          />
     
        </div>
       
        <div className="col-span-1">
          <label className="block text-gray-700">
            College Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="clg"
            value={formData.clg}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700">
            Branch<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700">
            Semester<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="sem"
            value={formData.sem}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700">
            Food Preference<span className="text-red-600">*</span>
          </label>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="foodPref"
              value="veg"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="mr-4">Veg</label>
            <input
              type="radio"
              name="foodPref"
              value="nonveg"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label>Non-veg</label>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700">
            Are you an IEEE member?<span className="text-red-600">*</span>
          </label>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="ieeeMember"
              value="yes"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="ieeeMember"
              value="no"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label>No</label>
          </div>
        </div>
        {formData.ieeeMember === "yes" && (
        <>
        <div className="col-span-1">
          <label className="block text-gray-700">
            Are you an CS Society member?<span className="text-red-600">*</span>
          </label>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="csMember"
              value="yes"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="csMember"
              value="no"
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label>No</label>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700">
            IEEE Membership ID<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="ieeeID"
            value={formData.ieeeID}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
            />
        </div>
            </>
        )}
        <div className='flex justify-center p-2 col-span-2'>
            <button type="submit" className="relative px-6 py-3 font-bold text-black group">
              <span className="absolute inset-0 rounded-xl w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-primary group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full rounded-xl border-2 border-black"></span>
              <span className="relative">Proceed to Pay</span>
            </button>

            </div>
      </form>
    </div>
  </div>
);

export default AdditionalInfoForm;
