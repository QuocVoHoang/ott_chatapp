import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useEffect, useState, useTransition } from "react"
import { Auth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth"
import { auth } from '@/lib/firebase/firebase'
import { Mail, Phone } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useRouter } from "next/navigation"
import PhoneLogin from "../phone_login/PhoneLogin"
import { CircularProgress } from "@mui/material"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isPhoneMethod, setIsPhoneMethod] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)


  ///////////////////////////////////////////////////////////////////////////////

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      loginHandler(auth, formData.email, formData.password)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="h-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="w-full h-full flex flex-col relative">
            <div className="flex flex-col items-center text-center mt-[20px]">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-muted-foreground">
                Login to your OTT_Chatapp account
              </p>
            </div>
            {!isPhoneMethod &&
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2 mt-[20px]">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <Button type="submit" className="w-full bg-mySecondary hover:bg-mySecondaryHover mt-[20px]" disabled={isLoading}>
                    Login
                  </Button>
                </div>

              </form>
            }

            {isLoading &&
              <div className="w-full h-full bg-[#00000099] absolute left-0 top-0 z-50 flex justify-center items-center">
                <CircularProgress sx={{ opacity: "1" }} />
              </div>
            }

            {isPhoneMethod && <PhoneLogin />}

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-[20px] px-[20px]">
              <Button variant="outline" className={`w-full ${!isPhoneMethod && "bg-myPrimary"} hover:bg-myPrimaryHover`} type="button"
                onClick={() => setIsPhoneMethod(false)}
              >
                <Mail />
                <span className="sr-only">Login with Email</span>
              </Button>
              <Button variant="outline" className={`w-full ${isPhoneMethod && "bg-myPrimary"} hover:bg-myPrimaryHover`} type="button"
                onClick={() => setIsPhoneMethod(true)}
              >
                <Phone />
                <span className="sr-only">Login with Phone number</span>
              </Button>
            </div>
            <div className="text-center text-sm my-[20px]">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
