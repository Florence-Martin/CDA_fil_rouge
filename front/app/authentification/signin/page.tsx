"use client";

import React from "react";

import { SignUpButton } from "@/app/components/authentification/SignUpButton";
import { CredentialsForm } from "@/app/components/authentification/CredentialForm";

export default function SignInPage() {
  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <h1 className="text-center text-4xl text-gray-400 font-bold">Sign In</h1>
        <CredentialsForm />
        <div className="w-full mt-2 block justify-between">
          <SignUpButton />
        </div>
      </div>
    </div>
  );
}
