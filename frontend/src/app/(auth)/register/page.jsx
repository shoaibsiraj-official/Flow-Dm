"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authAPI } from "@/lib/authApi";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import { registerSchema } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      workspace: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    alert("Form Submitted");
    console.log("Register Data:", data);
    setServerError("");

    try {
      const res = await authAPI.register({
        username: data.username,
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      router.push("/login");
    } catch (error) {
      if (error.response?.data) {
        console.log(error.response.data);
        setServerError(
          JSON.stringify(error.response.data)
        );
      } else {
        setServerError("Registration failed.");
      }
    }
  };

  return (
    <AuthShell>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
          Create your workspace
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Free 14-day trial. No card required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <div className="mt-1.5">
              <Input
                id="fullName"
                icon={User}
                placeholder="Jordan Lee"
                autoComplete="name"
                error={errors.fullName}
                {...register("fullName")}
              />
            </div>
            <FieldError>{errors.fullName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="workspace">Workspace</Label>
            <div className="mt-1.5">
              <Input
                id="workspace"
                icon={Building2}
                placeholder="Acme Studio"
                error={errors.workspace}
                {...register("workspace")}
              />
            </div>
            <FieldError>{errors.workspace?.message}</FieldError>
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1.5">
            <Input
              id="email"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              autoComplete="email"
              error={errors.email}
              {...register("email")}
            />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="username">Username</Label>

          <div className="mt-1.5">
            <Input
              id="username"
              icon={User}
              placeholder="shoaib"
              autoComplete="username"
              error={errors.username}
              {...register("username")}
            />
          </div>

          <FieldError>{errors.username?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Create a strong password"
              autoComplete="new-password"
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
          <PasswordStrength password={password} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="mt-1.5">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </div>

        <div>
          <label className="flex select-none items-start gap-2.5 pt-1 text-[13px] text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border bg-surface-sunken text-primary focus:ring-2 focus:ring-primary/30"
              {...register("agree")}
            />
            I agree to the{" "}
            <Link href="#" className="text-primary-400 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary-400 hover:text-primary">
              Privacy Policy
            </Link>
          </label>
          <FieldError>{errors.agree?.message}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {!isSubmitting && (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
          {isSubmitting && "Creating account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary-400 hover:text-primary">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
