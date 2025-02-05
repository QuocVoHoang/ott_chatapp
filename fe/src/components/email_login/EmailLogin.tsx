import { auth } from "@/lib/firebase/firebase";
import { Box, Button, TextField } from "@mui/material"
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function EmailLogin() {
  const loginHandler = async (auth: Auth, email: string, password: string) => {
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
        
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "150px",
          }}
        >
          <TextField
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            sx={{
              width: "100%",
              color: "text.primary"
            }}
          />
          <TextField
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              width: "100%",
              color: "text.primary",
              marginTop: "20px"
            }}
          />
        </Box>
        <Button type="submit" variant="contained" sx={{
          marginTop: "20px",
          textTransform: "none"
        }}>
          Login
        </Button>
      </Box>
    </Box>
  )
}