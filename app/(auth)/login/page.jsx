import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <main className="container mx-auto px-4 py-10">
      <Suspense fallback={<div>loading ...</div>}>
      <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;