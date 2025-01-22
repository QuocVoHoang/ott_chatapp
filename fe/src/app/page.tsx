// 'use client'

// import { Auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from '@/lib/firebase/firebase'
// import SideBar from "@/components/SideBar/SideBar";

// export default function Home() {
  
//   const signinHandler = async(auth: Auth, email: string, password: string) => {
//     console.log("SIGN IN")
//     signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });
//   }

//   const signoutHandler = async() => {
//     signOut(auth).then(() => {console.log('USER SIGNED OUT')}).catch((error) => {console.error(error)});
//   }


//   return (
//     <div className="flex flex-col">
//       {/* <button
//         onClick={() => {signinHandler(auth, 'test@gmail.com', 'test123test456')}}
//       >Login</button>
//       <button onClick={() => {signoutHandler()}}>Logout</button> */}
//       <SideBar />
//     </div>
//   );
// }



import { AppSidebar } from "@/components/SideBar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function SideBar() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  )
}
