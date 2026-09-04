import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("ایمیل و رمز عبور الزامی است");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+password");

        if (!user) {
          throw new Error("کاربری با این ایمیل یافت نشد");
        }

        if (!user.isActive) {
          throw new Error("حساب کاربری شما غیرفعال شده است");
        }

        const isValidPassword = await user.comparePassword(
          credentials.password
        );

        if (!isValidPassword) {
          throw new Error("رمز عبور اشتباه است");
        }

        user.lastLoginAt = new Date();
        await user.save();

        // آبجکتی که برگردانده می‌شود وارد callback جی‌دبلیوتی می‌شود
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 روز
    updateAge: 24 * 60 * 60, // هر ۲۴ ساعت توکن تازه‌سازی شود
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login", // خطاهای NextAuth به صفحه لاگین با query string ?error=... هدایت می‌شوند
  },    

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // اولین بار بعد از لاگین موفق، user موجود است
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }

      // امکان به‌روزرسانی توکن از کلاینت با useSession().update()
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.image = session.image ?? token.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },

    // async redirect({ url, baseUrl }) {
    //   // جلوگیری از ردایرکت به دامنه‌های خارجی
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    
  },
  

  secret: process.env.NEXTAUTH_SECRET,
  

  debug: process.env.NODE_ENV === "development",
};
