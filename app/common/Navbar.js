import Link from 'next/link'
import React from 'react'
import { useAuth } from '../providers/context'



const Navbar = () => {
  return (
    <Link href="/" className='h-20 w-full bg-pink-200 shadow-xl fixed top-0 left-0 flex justify-start items-center p-5'>
      Go back to home
    </Link>
  )
}

export default Navbar
