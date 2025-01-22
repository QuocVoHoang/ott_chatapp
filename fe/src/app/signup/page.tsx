'use client'

import { createUserWithEmailAndPassword, Auth } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { LoginForm } from "@/components/LoginForm/login-form";
import { SignupForm } from "@/components/LoginForm/signup-form";

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
}

