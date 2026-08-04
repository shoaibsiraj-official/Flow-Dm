"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MailCheck, ArrowRight, RotateCw } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { FieldError } from "@/components/ui/label";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    setError("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
  };

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <MailCheck className="h-6 w-6 text-primary-400" />
        </div>
        <h1 className="mt-5 text-[24px] font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Enter the 6-digit code we sent to your inbox to activate your
          workspace.
        </p>
      </div>

      <div className="mt-8">
        <OtpInput value={code} onChange={setCode} error={error} />
        <FieldError>{error}</FieldError>
      </div>

      <Button size="lg" className="mt-7 w-full" onClick={handleVerify} loading={loading}>
        {!loading && (
          <>
            Verify email <ArrowRight className="h-4 w-4" />
          </>
        )}
        {loading && "Verifying"}
      </Button>

      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className="mx-auto mt-5 flex items-center gap-1.5 text-[13px] font-medium text-primary-400 hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        <RotateCw className="h-3.5 w-3.5" />
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Wrong email?{" "}
        <Link href="/register" className="font-medium text-primary-400 hover:text-primary">
          Go back
        </Link>
      </p>
    </AuthShell>
  );
}
