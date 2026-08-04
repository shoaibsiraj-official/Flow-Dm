"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, MailCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    // await axios.post("/api/auth/forgot-password", data)
    await new Promise((r) => setTimeout(r, 900));
    setSentTo(data.email);
    setSent(true);
  };

  return (
    <AuthShell>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
              Reset your password
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Enter the email on your account and we'll send a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
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

              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                {!isSubmitting && (
                  <>
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </>
                )}
                {isSubmitting && "Sending"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
              <MailCheck className="h-6 w-6 text-success" />
            </div>
            <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-foreground">
              Check your inbox
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{sentTo}</span>. The
              link expires in 30 minutes.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="mt-7 w-full"
              onClick={() => setSent(false)}
            >
              Use a different email
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
