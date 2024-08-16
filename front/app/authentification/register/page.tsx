"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../utils/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        router.push("/authentification/signin");
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } catch (err) {
      setError("L'enregistrement a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false); // Assurez-vous que l'état de chargement est désactivé dans tous les cas
    }
  };

  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <h1 className="text-center text-4xl text-gray-400 font-bold mb-4">
          Sign Up
        </h1>
        <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
          <form
            onSubmit={handleRegister}
            className="w-full text-xl text-black font-semibold flex flex-col"
          >
            {error && (
              <span
                className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </span>
            )}
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
              aria-label="Name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
              aria-label="Email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
              aria-label="Password"
            />
            <button
              type="submit"
              className={`w-2/3 h-12 px-4 mt-4 text-lg text-white transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-600 mx-auto ${
                isLoading ? "bg-gray-400" : "bg-green-600"
              }`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
