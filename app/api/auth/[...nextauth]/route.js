// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// import bcrypt from "bcryptjs";

// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//         },

//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials) {
//         await connectDB();

//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const email = credentials.email
//           .trim()
//           .toLowerCase();

//         const password = credentials.password;

//         const user = await User.findOne({
//           email,
//         }).select("+password");

//         if (!user) {
//           return null;
//         }

//         if (!user.isActive) {
//           return null;
//         }

//         const isPasswordCorrect = await bcrypt.compare(
//           password,
//           user.password
//         );

//         if (!isPasswordCorrect) {
//           return null;
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }

//       return session;
//       console.log("session: " , session);
      
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };