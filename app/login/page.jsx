"use client";
import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useAuth } from "@/app/providers/context";
import { useRouter } from "next/navigation"; 


const Page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/tickets"); 
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative">
      <LoginForm/>
    </div>
  );
};

export default Page;
