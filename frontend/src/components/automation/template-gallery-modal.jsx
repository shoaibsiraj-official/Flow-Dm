"use client";

import { motion } from "framer-motion";
import { X, Workflow, ArrowRight, Sparkles } from "lucide-react";
import { WORKFLOW_TEMPLATES } from "@/lib/constants/automation-nodes";

export function TemplateGalleryModal({ onClose, onSelect }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />

      {/* Centered Modal Wrapper */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[880px] overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-soft"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                Create a new automation
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                Start from a template or build from scratch
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <button
              onClick={() => onSelect(null)}
              className="group mb-5 flex w-full items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.05] p-4 text-left transition-colors hover:border-primary/60 hover:bg-primary/[0.08]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-foreground">
                  Start from scratch
                </p>
                <p className="text-[12px] text-muted-foreground">
                  A blank canvas with just a trigger node
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-primary-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>

            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Or start from a template
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WORKFLOW_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  className="group flex flex-col items-start rounded-2xl border border-border bg-surface/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/15 hover:shadow-soft"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[18px]"
                    style={{ background: `${t.color}22` }}
                  >
                    {t.icon}
                  </div>

                  <p className="mt-3 text-[13.5px] font-semibold text-foreground">
                    {t.name}
                  </p>

                  <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
                    {t.description}
                  </p>

                  <span className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Workflow className="h-3 w-3" />
                    {t.nodes} nodes
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}