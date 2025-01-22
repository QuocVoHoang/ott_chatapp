'use client'

import { Auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '@/lib/firebase/firebase'
import { redirect } from "next/navigation";
import OtpLogin from "@/components/otp_login/OtpLogin";

export default function Home() {
  
  const signinHandler = async(auth: Auth, email: string, password: string) => {
    console.log("SIGN IN")
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  const signoutHandler = async() => {
    signOut(auth).then(() => {console.log('USER SIGNED OUT')}).catch((error) => {console.error(error)});
  }


  return (
    <div className="flex flex-col">
      <button
        onClick={() => {signinHandler(auth, 'test@gmail.com', 'test123test456')}}
      >Login</button>
      <button onClick={() => {signoutHandler()}}>Logout</button>
        {/* <OtpLogin /> */}
    </div>
  );
}
