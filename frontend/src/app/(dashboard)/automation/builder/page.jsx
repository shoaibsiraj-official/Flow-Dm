"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Check, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { NodePalette } from "@/components/automation/node-palette";
import { FlowCanvas } from "@/components/automation/flow-canvas";
import { NodeConfigPanel } from "@/components/automation/node-config-panel";
import { NODE_TYPES, BLANK_FLOW_NODES, SAMPLE_FLOW, WORKFLOW_TEMPLATES } from "@/lib/constants/automation-nodes";

let idCounter = 100;
const nextId = () => `n${idCounter++}`;

export default function AutomationBuilderPage() {
  const router = useRouter();
  const params = useSearchParams();
  const templateId = params.get("template");
  const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);

  const initial = useMemo(() => {
    if (templateId === null && params.get("flow")) return SAMPLE_FLOW;
    if (templateId) return SAMPLE_FLOW; // demo: any template loads the sample shape
    return { nodes: BLANK_FLOW_NODES, edges: [] };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [flowName, setFlowName] = useState(template ? template.name : "Untitled automation");
  const [nodes, setNodes] = useState(initial.nodes);
  const [edges, setEdges] = useState(initial.edges);
  const [selectedId, setSelectedId] = useState(null);
  const [active, setActive] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [renaming, setRenaming] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedId) || null;

  const handleDrag = (id, x, y) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const handleAddNext = (sourceId, typeKey) => {
    const source = nodes.find((n) => n.id === sourceId);
    if (!source) return;
    const def = NODE_TYPES[typeKey];
    const id = nextId();
    const newNode = {
      id,
      type: typeKey,
      x: source.x + 300,
      y: source.y,
      title: def.label,
      config: "",
    };
    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, { from: sourceId, to: id }]);
    setSelectedId(id);
  };

  const handleDropNode = (typeKey, x, y) => {
    const def = NODE_TYPES[typeKey];
    const id = nextId();
    setNodes((prev) => [...prev, { id, type: typeKey, x, y, title: def.label, config: "" }]);
    setSelectedId(id);
  };

  const handleDelete = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    setSelectedId((s) => (s === id ? null : s));
  };

  const handleUpdateNode = (updated) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 900);
    setTimeout(() => setSaveState("idle"), 2400);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Builder top bar */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
          <button
            onClick={() => router.push("/automation")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {renaming ? (
            <input
              autoFocus
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              onBlur={() => setRenaming(false)}
              onKeyDown={(e) => e.key === "Enter" && setRenaming(false)}
              className="rounded-lg border border-primary/40 bg-surface-sunken/60 px-2.5 py-1 text-[14.5px] font-semibold text-foreground focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setRenaming(true)}
              className="rounded-lg px-2.5 py-1 text-[14.5px] font-semibold text-foreground hover:bg-white/[0.05]"
            >
              {flowName}
            </button>
          )}

          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {nodes.length} nodes
          </span>

          <div className="ml-auto flex items-center gap-2.5">
            <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <span
                onClick={() => setActive((a) => !a)}
                className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
                  active ? "bg-success" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    active ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              {active ? "Active" : "Paused"}
            </label>
            <Button variant="secondary" size="sm">
              <Play className="h-3.5 w-3.5" /> Test flow
            </Button>
            <Button size="sm" onClick={handleSave} loading={saveState === "saving"}>
              {saveState === "idle" && "Save flow"}
              {saveState === "saving" && "Saving"}
              {saveState === "saved" && (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Builder body */}
        <div className="flex min-h-0 flex-1">
          <NodePalette onAdd={(type) => handleDropNode(type, 200 + Math.random() * 300, 400 + Math.random() * 200)} />
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDrag={handleDrag}
            onAddNext={handleAddNext}
            onDelete={handleDelete}
            onDropNode={handleDropNode}
          />
          <NodeConfigPanel node={selectedNode} onChange={handleUpdateNode} />
        </div>
      </div>

      <AnimatePresence>
        {saveState === "saved" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl border border-success/25 bg-surface-raised px-4 py-3 text-[13px] text-foreground shadow-soft"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-3.5 w-3.5" />
            </span>
            Automation saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
