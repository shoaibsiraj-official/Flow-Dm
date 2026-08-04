"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/authApi";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      // await axios.post("/api/auth/login", data)
      await new Promise((r) => setTimeout(r, 1100));
      // Simulated auth check for demo purposes
      if (data.password.length < 4) {
        setServerError("That email and password combination doesn't match our records.");
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      console.log("FULL ERROR:", error);

      console.log("STATUS:", error.response?.status);

      console.log("DATA:", error.response?.data);
      setServerError("Something went wrong on our end. Try again in a moment.");
    }
  };

  return (
    <AuthShell>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Sign in to keep your automations running.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" className="flex-1" size="lg">
          <GoogleIcon /> Google
        </Button>
        <Button variant="secondary" className="flex-1" size="lg">
          <InstagramIcon /> Instagram
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-5 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/10 px-3.5 py-3 text-[13px] text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="mt-1.5">
            <Input
              id="username"
              type="user"
              icon={Mail}
              placeholder="username"
              autoComplete="username"
              error={errors.username}
              {...register("username")}
            />
          </div>
          <FieldError>{errors.username?.message}</FieldError>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-[12.5px] font-medium text-primary-400 hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register("password")}
            />
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <label className="flex select-none items-center gap-2 pt-1 text-[13px] text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-surface-sunken text-primary focus:ring-2 focus:ring-primary/30"
            {...register("remember")}
          />
          Keep me signed in
        </label>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {!isSubmitting && (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
          {isSubmitting && "Signing in"}
        </Button>
      </form>

      <p className="mt-7 text-center text-[13.5px] text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-primary-400 hover:text-primary">
          Create one free
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 6.9 2.2 2.7 6.4 2.7 11.5S6.9 20.8 12 20.8c6.9 0 9.6-4.8 9.6-7.3 0-.5-.05-.9-.13-1.3H12z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.06 1.97.24 2.43.42.6.24 1.03.53 1.48.98.45.45.74.88.98 1.48.18.46.36 1.26.42 2.43.07 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.06 1.17-.24 1.97-.42 2.43a4 4 0 01-.98 1.48 4 4 0 01-1.48.98c-.46.18-1.26.36-2.43.42-1.25.07-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.06-1.97-.24-2.43-.42a4 4 0 01-1.48-.98 4 4 0 01-.98-1.48c-.18-.46-.36-1.26-.42-2.43C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.06-1.17.24-1.97.42-2.43.24-.6.53-1.03.98-1.48.45-.45.88-.74 1.48-.98.46-.18 1.26-.36 2.43-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.98c-3.15 0-3.52 0-4.76.07-.96.04-1.48.2-1.83.34-.46.18-.79.4-1.13.75-.35.34-.57.67-.75 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.61-.07 4.76s0 3.52.07 4.76c.04.96.2 1.48.34 1.83.18.46.4.79.75 1.13.34.35.67.57 1.13.75.35.14.87.3 1.83.34 1.24.06 1.61.07 4.76.07s3.52 0 4.76-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.4 1.13-.75.35-.34.57-.67.75-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.61.07-4.76s0-3.52-.07-4.76c-.04-.96-.2-1.48-.34-1.83a2.98 2.98 0 00-.75-1.13 2.98 2.98 0 00-1.13-.75c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.61-.07-4.76-.07zm0 3.4a4.42 4.42 0 110 8.84 4.42 4.42 0 010-8.84zm0 7.29a2.87 2.87 0 100-5.74 2.87 2.87 0 000 5.74zm5.63-7.46a1.03 1.03 0 11-2.06 0 1.03 1.03 0 012.06 0z" />
    </svg>
  );
}
