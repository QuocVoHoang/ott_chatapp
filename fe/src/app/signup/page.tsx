'use client'

import { createUserWithEmailAndPassword, Auth } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function Register() {
  const router = useRouter()

  const registerUser = async(auth: Auth, email: string, password: string) => {
    console.log("SIGN UP")
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      console.log('user', user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('errorCode', errorCode)
      console.error('errorMessage', errorMessage)
    });
  }

  const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: ""
    })
  
    const handleChange = (e: any) => {
      const { name, value } = e.target
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: any) => {
      e.preventDefault()
      if(formData.confirmPassword == formData.password) {
        registerUser(auth, formData.email, formData.password)
      }
    }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #9CA3AF",
          borderRadius: "8px"
        }}
      >
        <TextField
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          sx={{
            width: "400px",
            color: "text.primary"
          }}
        />
        <TextField
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          sx={{
            width: "400px",
            color: "text.primary",
            marginTop: "20px"
          }}
        />
        <TextField
          name="confirmPassword"
          placeholder="Confirmed password"
          value={formData.confirmPassword}
          onChange={handleChange}
          sx={{
            width: "400px",
            color: "text.primary",
            marginTop: "20px"
          }}
        />
        <Button type="submit" variant="contained" sx={{
          marginTop: "20px",
          textTransform: "none"
        }}>
          Register
        </Button>
        <Button
          sx={{
            marginTop: "20px",
            textTransform: "none",
            backgroundColor: "background.default"
          }}
          onClick={() => {router.push('/signin')}}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  )
}

