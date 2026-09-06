import LoginForm from "@/components/auth/LoginForm";
import LoadingDots from "@/components/Loading";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  // console.log("session : ", session);
  if(session){
    redirect("/profile")
  }
  return (
    <main className="container mx-auto px-4 py-10">
      <Suspense fallback={<LoadingDots />}>
      <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;