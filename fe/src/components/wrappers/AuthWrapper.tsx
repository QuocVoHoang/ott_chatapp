'use client'

import { redirect, usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useEffect } from "react";

import { useContext } from 'react';


export default function AuthWrapper({children}:{children: React.ReactNode}){

  const router = useRouter()
  const currentUser = auth.currentUser
  const pathname = usePathname()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/')
      } else if (!user && pathname != '/signin' && pathname != '/signup') {
        router.push('/signin')
      }
    });
  }, [currentUser, pathname])

  return(
    <div>
      {children}
    </div>
  )
}