import { getCurrentUser } from "@/actions/onboarding";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { AlertCircle, ClipboardCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const VerificationPage = async () => {
  const user = await getCurrentUser();

  // Redirect if not a doctor
  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  // If already verified, redirect to dashboard
  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-900/20">
          <CardHeader className="text-center">
            <div className={'mx-auto p-4 ${ isRejected ? "bg-red-900/20" : "bg-amber-900/20") } rounded-full mb-4 w-fit'}>
              {isRejected ? (
                <XCircle className="h-8 w-8 text-red-400" />
              ) : (
                <ClipboardCheck className="h-8 w-8 text-amber-400" />
              )}
            </div>

            <CardTitle>
              {isRejected ? "Verification Rejected" : "Verification Pending"}
            </CardTitle>

            <CardDescription>
              {isRejected
                ? "Your verification was rejected. Please review and resubmit."
                : "Your documents are under review."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRejected ? (
                <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-muted-foreground text-left">
                        <p className="mb-2">
                            Our administration team has reviewed your submitted documents and found some
                            issues that need to be addressed before we can verify your account.Reasons include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li>Incsufficient or unclear credential documentation</li>
                            <li>Professional experience requirements not met</li>
                            <li>Incomplete or vague service description</li>   
                        </ul>
                        <p>
                            Please update your profile and resubmit the necessary documents for verification.
                        </p>
                    </div>
                </div> 
            ) : (
                <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-left">
                        Your documents are under review. This process typically takes 2-3 business days. 
                        You will receive an email notification once the review is complete and your account is verified.
                    </p>
                </div>
            )}   
            <p className="text-muted-foreground mb-6">
                {isRejected
                  ? "To resubmit your documents, please navigate to your profile page, update the necessary information, and upload the required credentials again."
                  : "Thank you for your patience during this process. If you have any questions, feel free to contact our support team."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                asChild variant="outline" 
                className="border-emerald-900/30"
                >
                    <Link href="/">Return to Home</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
