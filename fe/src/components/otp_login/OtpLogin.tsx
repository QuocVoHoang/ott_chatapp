'use client'

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState, useTransition } from "react"
import { auth } from "@/lib/firebase/firebase"
import { CircularProgress } from "@mui/material"

function OtpLogin() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState("")
  const [resendCountdown, setResendCountdown] = useState(0)

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if(resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer)
  }, [resendCountdown])

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible"
      }
    )

    setRecaptchaVerifier(recaptchaVerifier)

    return () => {
      recaptchaVerifier.clear()
    }
  }, [auth])

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6
    if(hasEnteredAllDigits) {
      console.log("hasEnteredAllDigits", hasEnteredAllDigits)
      verifyOtp()
    }
  }, [otp])

  const verifyOtp = async() => {
    startTransition(async() => {
      setError("")
      if(!confirmationResult) {
        setError("Please request otp first.")
        return;
      }
      try {
        await confirmationResult?.confirm(otp)
        router.replace('/')
      } catch(e) {
        console.error(e)
        setError("Verified otp failed. Please check otp again.")
      }
    })
  }

  const requestOtp = async(e?: FormEvent<HTMLFormElement>) => {
    console.log('requestOtp')
    e?.preventDefault()
    setResendCountdown(60)
    startTransition(async() => {
      setError("")
      if(!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized")
      }
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        )
        setConfirmationResult(confirmationResult)
        setSuccess("OTP sent successfully.")
      }catch(e:any) {
        console.error(e)
        setResendCountdown(0)
        if(e.code == "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check phone number again.")
        } else if(e.code == "auth/too-many-requests") {
          setError("Too many requests. Please try again.")
        } else {
          setError("Failed to send OTP. Please try again.")
        }
      }
    })
  }

  return(
    <div>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input 
            className="text-black"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p>
            Please input your phone number with country code (i.e. +84)
          </p>
        </form>
      )}

      {confirmationResult && (
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0}/>
            <InputOTPSlot index={1}/>
            <InputOTPSlot index={2}/>
            <InputOTPSlot index={3}/>
            <InputOTPSlot index={4}/>
            <InputOTPSlot index={5}/>
          </InputOTPGroup>
        </InputOTP>
      )}

      <Button
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => requestOtp()}
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}`
          : isPending
          ? "Sending OTP"
          : "Send OTP"
        }
      </Button>

      <div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container" />

      {isPending && <CircularProgress />}


    </div>
  )
}

export default OtpLogin