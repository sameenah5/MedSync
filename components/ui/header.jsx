import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { checkUser } from "@/lib/checkUser";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Calendar, CreditCard, ShieldCheck, Stethoscope } from 'lucide-react';

import { User } from 'lucide-react';
import { Button } from '../button';
import { checkAndAllocateCredits } from '@/actions/credits';
import { Badge } from '../badge';


const Header = async () => {
  let user = await checkUser();

  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
    user = await checkUser(); // re-fetch updated user
  }


  return (
   <header className="fixed top-0 left-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports 
   [backdrop-filter]:bg-background/60">
    <nav className='container mx-auto flex h-16 items-center px-4 justify-between'>
      <Link href="/">
      <Image
       src="/logo-single.png" 
       alt="MedSync Logo"
       width={200}
       height={60} 
       className="h-10 w-auto object-contain"
        />
      
      </Link>
      <div className='flex items-center space-x-2'>

        <SignedIn>
            {/* Admin Links */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Doctor Links */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Patient Links */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            {/* Unassigned User - Complete Profile */}

            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </SignedIn>

                  {(!user || user?.role !== "ADMIN") && (
            <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned Credits"}
                      </span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}
          
          <SignedOut>
              <SignInButton>
                <Button variant="secondary">Sign In</Button>
              </SignInButton>
              
          </SignedOut>
 
          <SignedIn>
             <UserButton
              appearance={{
                elements: {
                  AvatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              />
          </SignedIn>
      </div>
    </nav>
  </header>
  ) 
};

export default Header