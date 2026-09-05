import RegisterForm from "@/components/auth/RegisterForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const RegisterPage = () => {
  const session = getServerSession(authOptions);
    if(session){
      redirect("/profile")
    }
  return (
    <main className="mx-auto container flex min-h-screen items-center justify-center bg-plum-950 p-4 ">
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;