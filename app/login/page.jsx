"use client";
import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useAuth } from "@/app/providers/context";


const Page = () => {


  return (
    <div className="relative">
      <LoginForm/>
    </div>
  );
};

export default Page;
