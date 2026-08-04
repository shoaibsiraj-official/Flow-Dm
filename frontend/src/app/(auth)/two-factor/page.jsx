"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, KeyRound } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { FieldError } from "@/components/ui/label";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary-400" />
        </div>
        <h1 className="mt-5 text-[24px] font-semibold tracking-tight text-foreground">
          Two-factor verification
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Open your authenticator app and enter the 6-digit code for FlowDM
          AI.
        </p>
      </div>

      <div className="mt-8">
        <OtpInput value={code} onChange={setCode} error={error} />
        <FieldError>{error}</FieldError>
      </div>

      <label className="mt-5 flex select-none items-center justify-center gap-2 text-[13px] text-muted-foreground">
        <input
          type="checkbox"
          checked={trust}
          onChange={(e) => setTrust(e.target.checked)}
          className="h-4 w-4 rounded border-border bg-surface-sunken text-primary focus:ring-2 focus:ring-primary/30"
        />
        Trust this device for 30 days
      </label>

      <Button size="lg" className="mt-6 w-full" onClick={handleVerify} loading={loading}>
        {!loading && (
          <>
            Verify identity <ArrowRight className="h-4 w-4" />
          </>
        )}
        {loading && "Verifying"}
      </Button>

      <Link
        href="#"
        className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-[13px] font-medium text-primary-400 hover:text-primary"
      >
        <KeyRound className="h-3.5 w-3.5" />
        Use a backup code instead
      </Link>
    </AuthShell>
  );
}
