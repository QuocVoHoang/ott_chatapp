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


export default function Login() {
  const router = useRouter()

  const [isLoginWithPhone, setIsLoginWithPhone] = useState(false)

  const onChangeLoginMethod = () => {
    setIsLoginWithPhone(prev => !prev)
  }


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

      }}
    >
      <Box
        sx={{
          width: "700px",
          height: "400px",
          padding: "50px",
          border: "1px solid #9CA3AF",
          borderRadius: "8px"
        }}
      >
        {
          isLoginWithPhone ?
            <PhoneLogin /> :
            <EmailLogin />
        }
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button
            onClick={onChangeLoginMethod}
          >Login with phone number</Button>
          <Button>REGISTER NEW ACCOUNT</Button>
        </Box>
      </Box>

    </Box>
  );
}