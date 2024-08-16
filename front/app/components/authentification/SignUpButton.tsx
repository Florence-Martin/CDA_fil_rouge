"use client";

import { useRouter } from "next/navigation";

export function SignUpButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/authentification/register");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-12 mt-4 text-lg text-white transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-600"
    >
      Sign Up
    </button>
  );
}
