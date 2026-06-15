import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-black uppercase text-primary">
            Chae<span className="text-foreground">GPT</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
