import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Auth, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const registerUser = async(auth: Auth, email: string, password: string) => {
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
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if(formData.confirmPassword == formData.password) {
        registerUser(auth, formData.email, formData.password)
      }
    }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-balance text-muted-foreground">
                  Fill in the form to create an account.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  name="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            
              <Button type="submit" className="w-full">
                Signup
              </Button>
              <div className="text-center text-sm">
                You have an account?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Signin
                </a>
              </div>
            </div>
          </form>
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
