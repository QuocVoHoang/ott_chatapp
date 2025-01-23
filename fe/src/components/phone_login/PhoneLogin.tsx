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
import { Label } from "@/components/ui/label"
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function PhoneLogin() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState("")
  const [resendCountdown, setResendCountdown] = useState(0)

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCountdown > 0) {
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
    if (hasEnteredAllDigits) {
      console.log("hasEnteredAllDigits", hasEnteredAllDigits)
      verifyOtp()
    }
  }, [otp])

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("")
      if (!confirmationResult) {
        setError("Please request otp first.")
        return;
      }
      try {
        await confirmationResult?.confirm(otp)
        router.replace('/')
      } catch (e) {
        console.error(e)
        setError("Verified otp failed. Please check otp again.")
      }
    })
  }

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    console.log('requestOtp', phoneNumber)
    e?.preventDefault()
    setResendCountdown(60)
    startTransition(async () => {
      setError("")
      if (!recaptchaVerifier) {
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
      } catch (e: any) {
        console.error(e)
        setResendCountdown(0)
        if (e.code == "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check phone number again.")
        } else if (e.code == "auth/too-many-requests") {
          setError("Too many requests. Please try again.")
        } else {
          setError("Failed to send OTP. Please try again.")
        }
      }
    })
  }

  return (
    <div className="w-full">
      <div className="w-full flex"> 
        {!confirmationResult && (
          <form onSubmit={requestOtp} className="mt-[20px] w-full">
            <div className="w-[90%] pl-[20px]">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <PhoneInput
                defaultCountry={'vn'}
                value={phoneNumber}
                onChange={phone => setPhoneNumber(phone)}
              />
            </div>
          </form>
        )}

        {confirmationResult && (
          <div className="w-full h-[80px] p-[20px] pt-[30px]">
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        {isPending && 
          <div className="flex h-[80px] pt-[20px] pr-[20px] items-center justify-center">
            <CircularProgress />
          </div>
        }
      </div>
      

      <div className="w-full px-[20px] mt-[20px]">
        <Button
          className="w-full bg-mySecondary hover:bg-mySecondaryHover mb-[20px]"
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
      </div>

      <div>
        {error && <p className="text-red-500 pl-[20px]">{error}</p>}
        {success && <p className="text-green-500 pl-[20px] pb-[10px]">{success}</p>}
      </div>

      <div id="recaptcha-container" />




    </div>
  )
}