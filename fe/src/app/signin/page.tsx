'use client'

import { Auth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth"
import { auth } from '@/lib/firebase/firebase'
import React, { useState } from "react"
import { TextField, Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import OtpLogin from "@/components/otp_login/OtpLogin"


export default function Login() {
  const router = useRouter()

  const [isLoginWithPhone, setIsLoginWithPhone] = useState(false)

  const loginHandler = async (auth: Auth, email: string, password: string) => {
    console.log("SIGN IN")
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");

  auth.languageCode = 'it'

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault()
    loginHandler(auth, formData.email, formData.password)
  }

  const onChangeLoginMethod = () => {
    setIsLoginWithPhone(prev => !prev)
  }

  const [phone, setPhone] = useState("")

  const sendOtp = async() => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha)
      console.log('confirmation', confirmation)
    } catch(e) {
      console.error(e)
    }
    
  }

  return (
    // <div>
    //   <PhoneInput
    //     placeholder="Enter phone number"
    //     country={'vn'}
    //     value={phone}
    //     onChange={(phone) => setPhone("+" + phone)}
    //   />
      

    //   <Button onClick={sendOtp}>Send otp</Button>
    //   <div id='recaptcha'></div>

    //   <TextField
    //     placeholder="Phone number"
    //     value={phoneNumber}
    //     onChange={(e: any) => setPhoneNumber(e.value)}
    //     sx={{
    //       width: "100%",
    //       color: "text.primary"
    //     }}
    //   />
    //   <Button onClick={() => {sendOtp()}}>Verify otp</Button>
    // </div>
    <div>
      <OtpLogin />
    </div>
  );

  // return (
  //   <Box
  //     sx={{
  //       width: "100%",
  //       height: "100%",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center"
  //     }}
  //   >
  //     <Box
  //       component="form"
  //       onSubmit={handleSubmit}
  //       sx={{
  //         padding: "50px",
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         border: "1px solid #9CA3AF",
  //         borderRadius: "8px"
  //       }}
  //     >
  //       {
  //         isLoginWithPhone ?
  //           <Box
  //             sx={{
  //               width: "500px",
  //               height: "150px"
  //             }}
  //           >
  //             <TextField
  //               name="phone"
  //               placeholder="Phone number"
  //               value={phoneNumber}
  //               onChange={(e: any) => setPhoneNumber(e.value)}
  //               sx={{
  //                 width: "100%",
  //                 color: "text.primary"
  //               }}
  //             />
  //           </Box> :
  //           <Box
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               width: "500px",
  //               height: "150px",
  //             }}
  //           >
  //             <TextField
  //               name="email"
  //               placeholder="Email"
  //               value={formData.email}
  //               onChange={handleChange}
  //               sx={{
  //                 width: "100%",
  //                 color: "text.primary"
  //               }}
  //             />
  //             <TextField
  //               name="password"
  //               placeholder="Password"
  //               value={formData.password}
  //               onChange={handleChange}
  //               sx={{
  //                 width: "100%",
  //                 color: "text.primary",
  //                 marginTop: "20px"
  //               }}
  //             />
  //           </Box>
  //       }

  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "row",
  //           width: "100%",
  //           justifyContent: "space-evenly"
  //         }}
  //       >
  //         <Button type="submit" variant="contained" sx={{
  //           marginTop: "20px",
  //           textTransform: "none"
  //         }}>
  //           Login
  //         </Button>
  //         <Button type="submit" variant="contained"
  //           sx={{
  //             marginTop: "20px",
  //             textTransform: "none"
  //           }}
  //           onClick={onChangeLoginMethod}
  //         >
  //           {isLoginWithPhone ? "Login with email" : "Login with phone number"}
  //         </Button>
  //       </Box>
  //       <Button
  //         sx={{
  //           marginTop: "20px",
  //           textTransform: "none",
  //           backgroundColor: "background.default"
  //         }}
  //         onClick={() => { router.push('/signup') }}
  //       >
  //         Sign up
  //       </Button>
  //     </Box>
  //   </Box>
  // )
}