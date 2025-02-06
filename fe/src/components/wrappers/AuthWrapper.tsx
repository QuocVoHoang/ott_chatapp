'use client'

import { redirect, usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/lib/redux/store";
import { setUserInformation } from "@/lib/redux/userSlice";


export default function AuthWrapper({children}:{children: React.ReactNode}){

  const router = useRouter()
  const currentUser = auth.currentUser
  const pathname = usePathname()
  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      let newName = ''
      if(user?.displayName) {
        newName = user.displayName
      } else if(user?.email) {
        newName = user.email
      } else if(user?.phoneNumber){
        newName = `${user?.phoneNumber}`
      } else {
        newName = 'No Name'
      }
      if (user) {
        dispatch(setUserInformation({
          newUsername: newName,
          newEmail: user.email!,
          newPhotoUrl: user.photoURL ? user.photoURL : "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
          newUid: user.uid
        }))
        router.push('/')
      } else if (!user && pathname != '/signin' && pathname != '/signup') {
        router.push('/signin')
      }
    });
  }, [currentUser, pathname])

  return(
    <div>
      {children}
    </div>
  )
}