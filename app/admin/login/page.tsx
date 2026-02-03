"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin"
    });
    if (result?.error) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Login Admin</h1>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
