//app/libs/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";  //install it
import { compare } from "bcrypt";
import prisma from "./prisma";
const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  //check next auth .js for further features like singnout error etc
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Check if user credentials are Correct
          if (!credentials?.email || !credentials?.password) {
            console.log("Not Inputs");
            return null;
          }
          //Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!existingUser) {
            console.log("No user found");
            return;
          }
          //Check if Password is correct
          const passwordMatch = await compare(
            credentials.password,
            existingUser.hashedPassword
          );
          if (!passwordMatch) {
            console.log("Password incorrect");
            return null;
          }
          const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
          };
          console.log(user);
          return user;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

export { authOptions };