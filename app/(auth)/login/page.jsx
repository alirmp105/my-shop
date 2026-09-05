import LoginForm from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const LoginPage = () => {
  const session = getServerSession(authOptions);
  if(session){
    redirect("/profile")
  }
  return (
    <main className="container mx-auto px-4 py-10">
      <Suspense fallback={<div>loading ...</div>}>
      <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;