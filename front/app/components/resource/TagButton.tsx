import Link from "next/link";
import React from "react";

export function TagButton() {
  return (
    <Link
      href="/resources/tag"
      className="bg-transparent text-white font-normal w-10 h-10 border-2 border-white flex items-center justify-center rounded hover:bg-white hover:text-gray-900 transition duration-200 ml-8"
    >
      TAG
    </Link>
  );
}