import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const PaymentStep = ({ formData, handleChange, handleSubmit }) => {
  const [localFormData, setLocalFormData] = useState({
    paymentScreenshot: null,
    ticketAmount: "Rs. 699/-",
    numericAmount: 699,
  });
  const [isScreenshotUploaded, setIsScreenshotUploaded] = useState(false);

  useEffect(() => {
    const formDataString = localStorage.getItem("formData");
    const formDataObject = formDataString ? JSON.parse(formDataString) : {};
    const { ieeeMember, csMember, refmail } = formDataObject;

    let ticketAmount = "Rs. 699/-";
    if (refmail === 'theadmindiscount@ieee.org') {
      ticketAmount = "Rs. 1/-";
    } else if (ieeeMember === "yes" && csMember === "yes") {
      ticketAmount = "Rs. 499/-";
    } else if (ieeeMember === "yes") {
      ticketAmount = "Rs. 549/-";
    } else if (ieeeMember === "no" && refmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(refmail)) {
        ticketAmount = "Rs. 599/-";
      }
    }

    const numericAmount = parseInt(ticketAmount.replace(/[^0-9]/g, ""), 10);
    
    setLocalFormData((prevFormData) => ({
      ...prevFormData,
      ticketAmount,
      numericAmount,
    }));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLocalFormData((prevFormData) => ({
      ...prevFormData,
      paymentScreenshot: file,
    }));
    setIsScreenshotUploaded(!!file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center p-4 space-y-4 bg-white rounded-lg"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Payment Details</h2>
        <p className="text-sm text-gray-500">
          Please upload your payment screenshot after completing the payment.
        </p>
      </div>
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Payment Screenshot
        </label>
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800">
            Ticket Amount: {localFormData.ticketAmount}
          </div>
          <input
            type="file"
            name="paymentScreenshot"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center space-y-4">
        <div className="text-center w-full flex flex-col justify-center items-center">
          <Link href="upi://pay?pa=itsmelvinsabu@okaxis&pn=Melvin%20Sabu&aid=uGICAgICXh8r-CQ">
            <div className="flex justify-center w-full">
              {/* <QRCode value={`upi://pay?pa=9605286714@okbizaxis&pn=MELVIN%20SABU&mc=8220&aid=uGICAgMD566y-Tw&ver=01&mode=01&tr=BCR2DN4TYHAY5EDU`} /> */}
              <Image src="/assets/paymentqr.jpg" height={180} width={180}/>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Scan the QR code to make the payment.
            </p>
          </Link>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Or use the following details:</p>
          <p className="text-sm text-gray-700 font-semibold">
            Name : Melvin Sabu 
          </p>
          <p className="text-sm text-gray-700 font-semibold">
            UPI ID: itsmelvinsabu@okaxis
          </p>
          <p className="text-sm text-gray-700 font-semibold">
            Account Number: 5556053000062638
          </p>
          <p className="text-sm text-gray-700 font-semibold">
            Bank IFSC: SIBL0000676
          </p>
        </div>
      </div>
      <button type="submit" disabled={!isScreenshotUploaded} className="relative px-6 py-3 font-bold text-black group">
              <span className="absolute inset-0 rounded-xl w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-primary group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full rounded-xl border-2 border-black"></span>
              <span className="relative">1 2 3 ....Goo</span>
            </button>
    </form>
  );
};

export default PaymentStep;
