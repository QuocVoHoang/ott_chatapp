'use client'

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

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

