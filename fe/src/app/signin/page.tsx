'use client'

import { Auth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth"
import { auth } from '@/lib/firebase/firebase'
import React, { useState } from "react"
import { TextField, Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import PhoneLogin from "@/components/phone_login/PhoneLogin"
import EmailLogin from "@/components/email_login/EmailLogin"
import { LoginForm } from "@/components/LoginForm/login-form"


export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}