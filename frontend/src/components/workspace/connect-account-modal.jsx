"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Check, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { permissionsList } from "@/lib/mock/workspace-data";

export function ConnectAccountModal({ onClose, onConnected }) {
  const [step, setStep] = useState("intro");

  const handleConnect = () => {
    setStep("connecting");
    setTimeout(() => setStep("success"), 1800);
  };

  const handleDone = () => {
    onConnected();
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== "connecting" ? onClose : undefined}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />

      {/* Center Wrapper */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-soft"
        >
          {step !== "connecting" && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600">
                  <Camera className="h-6 w-6 text-white" />
                </div>

                <h2 className="mt-4 text-[18px] font-semibold tracking-tight text-foreground">
                  Connect an Instagram account
                </h2>

                <p className="mt-1.5 text-[13px] text-muted-foreground">
                  FlowDM AI will request the following permissions from Meta:
                </p>

                <ul className="mt-4 space-y-2.5">
                  {permissionsList.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-[13px] text-foreground/85"
                    >
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-400" />
                      {p}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleConnect}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Continue with Instagram
                </Button>

                <p className="mt-3 text-center text-[11.5px] text-muted-foreground">
                  You'll be redirected to Meta to approve access.
                </p>
              </motion.div>
            )}

            {step === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center px-6 py-14 text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />

                <p className="mt-4 text-[14px] font-medium text-foreground">
                  Connecting to Instagram…
                </p>

                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  Verifying permissions with Meta
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-8 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/12">
                  <Check className="h-6 w-6 text-success" />
                </div>

                <h2 className="mt-4 text-[17px] font-semibold tracking-tight text-foreground">
                  Account connected!
                </h2>

                <p className="mt-1.5 text-[13px] text-muted-foreground">
                  @acme.newshop is now live. FlowDM AI is syncing your latest
                  DMs and comments.
                </p>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleDone}
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>,
    document.body
  );
}