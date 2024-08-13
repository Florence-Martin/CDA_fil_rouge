
import NextAuth, { DefaultSession } from "next-auth";

 // Étend l'interface User pour inclure les propriétés de votre entité User
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    role:string;
    provider?: string;
  }

  // Étend l'interface Session pour inclure l'ID utilisateur et les propriétés de base, ainsi que l'accessToken
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role:string;
      provider?: string; // Ajoute le provider si nécessaire dans la session
    } & DefaultSession["user"];
    accessToken?: string; // Ajoute accessToken pour gérer l'authentification via OAuth
  }

  // Étend l'interface JWT pour inclure l'ID utilisateur
  interface JWT {
    id: string;
    email: string;
    name: string;
    role:string;
    provider?: string; // Ajoute le provider si nécessaire dans le JWT
  }
}
