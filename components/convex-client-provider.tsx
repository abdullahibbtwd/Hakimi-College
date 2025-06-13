"use client"

import { ReactNode } from "react"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import {ConvexReactClient} from "convex/react"
import {ConvexProviderWithClerk} from "convex/react-clerk"
import { Toaster } from 'sonner';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({children}:{children:ReactNode}){
    return(

        <ClerkProvider publishableKey="pk_test_dG9sZXJhbnQtbW9ua2Zpc2gtNzUuY2xlcmsuYWNjb3VudHMuZGV2JA">
             <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                 <Toaster />
            {children}
        </ConvexProviderWithClerk>
        </ClerkProvider>
       
    )
}
