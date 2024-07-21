
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './home/loader.css'
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/signup');
  }, [router]);

  return (
    <main className="h-screen w-full justify-center bg-black items-center flex">
      <div className="loader"></div>
    </main>
  );
}
