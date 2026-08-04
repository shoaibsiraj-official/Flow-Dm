"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FlowNode, NODE_WIDTH, NODE_HEIGHT } from "./flow-node";
import { NODE_TYPES } from "@/lib/constants/automation-nodes";
import { cn } from "@/lib/utils";

function edgePath(from, to) {
    const x1 = from.x + NODE_WIDTH;
    const y1 = from.y + NODE_HEIGHT / 2;
    const x2 = to.x;
    const y2 = to.y + NODE_HEIGHT / 2;
    const dx = Math.max(60, (x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

const QUICK_PICK_TYPES = ["condition", "ai", "delay", "tag", "assign", "lead", "webhook", "end"];

export function FlowCanvas({ nodes, edges, selectedId, onSelect, onDrag, onAddNext, onDelete, onDropNode }) {
    const [pan, setPan] = useState({
        x: window.innerWidth / 4,
        y: window.innerHeight / 6,
    });
    const [zoom, setZoom] = useState(1);
    const [popoverFor, setPopoverFor] = useState(null);
    const panRef = useRef(null);

    const handleBgPointerDown = (e) => {
        if (e.target !== e.currentTarget) return;
        onSelect(null);
        setPopoverFor(null);
        const startX = e.clientX;
        const startY = e.clientY;
        const origin = { ...pan };
        const move = (ev) => setPan({ x: origin.x + (ev.clientX - startX), y: origin.y + (ev.clientY - startY) });
        const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    const bounds = { w: 1600, h: 900 };

    return (
        <div
            className="relative flex-1 overflow-hidden bg-surface-sunken/40"
            onWheel={(e) => {
                e.preventDefault();

                setZoom((z) => {
                    const next = Math.max(0.5, Math.min(2, z + (e.deltaY < 0 ? 0.1 : -0.1)));

                    setPan((p) => ({
                        x: p.x - (e.clientX * (next - z)),
                        y: p.y - (e.clientY * (next - z)),
                    }));

                    return next;
                });
            }}
            onPointerDown={handleBgPointerDown}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const type = e.dataTransfer.getData("node-type");
                if (!type) return;
                const rect = e.currentTarget.getBoundingClientRect();
                onDropNode(type, e.clientX - rect.left - pan.x, e.clientY - rect.top - pan.y);
            }}
            style={{
                backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                backgroundPosition: `${pan.x}px ${pan.y}px`,
                cursor: "grab",
            }}
        >
            <div
                className="absolute left-0 top-0"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                }}
            >
                <svg width={bounds.w} height={bounds.h} className="pointer-events-none absolute left-0 top-0">
                    {edges.map((e, i) => {
                        const from = nodes.find((n) => n.id === e.from);
                        const to = nodes.find((n) => n.id === e.to);
                        if (!from || !to) return null;
                        const midX = (from.x + NODE_WIDTH + to.x) / 2;
                        const midY = (from.y + to.y) / 2 + NODE_HEIGHT / 2;
                        return (
                            <g key={i}>
                                <path d={edgePath(from, to)} fill="none" stroke="#3F3F46" strokeWidth="2" />
                                {e.label && (
                                    <foreignObject x={midX - 20} y={midY - 11} width="40" height="22">
                                        <div className="flex h-[22px] items-center justify-center rounded-full border border-border bg-surface-raised text-[10px] font-medium text-muted-foreground">
                                            {e.label}
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {nodes.map((node) => (
                    <FlowNode
                        key={node.id}
                        node={node}
                        selected={selectedId === node.id}
                        onSelect={onSelect}
                        onDrag={onDrag}
                        onAddNext={(id) => setPopoverFor(id)}
                        onDelete={onDelete}
                        canDelete={node.type !== "trigger"}
                    />
                ))}

                {popoverFor &&
                    (() => {
                        const source = nodes.find((n) => n.id === popoverFor);
                        if (!source) return null;
                        return (
                            <div
                                style={{ left: source.x, top: source.y + NODE_HEIGHT + 22, width: NODE_WIDTH + 40 }}
                                className="absolute z-20 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-soft"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <p className="px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Add next step
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    {QUICK_PICK_TYPES.map((typeKey) => {
                                        const t = NODE_TYPES[typeKey];
                                        const Icon = t.icon;
                                        return (
                                            <button
                                                key={typeKey}
                                                onClick={() => {
                                                    onAddNext(popoverFor, typeKey);
                                                    setPopoverFor(null);
                                                }}
                                                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.06]"
                                            >
                                                <div
                                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                                                    style={{ background: `${t.color}22`, color: t.color }}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="truncate text-[12px] text-foreground/90">{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
            </div>
            <div className="absolute bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised shadow-soft">
                <button
                    onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                    className="flex h-10 w-10 items-center justify-center hover:bg-white/10"
                >
                    <Plus className="h-4 w-4" />
                </button>

                <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                    className="flex h-10 w-10 items-center justify-center border-t border-border hover:bg-white/10"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <div className="border-t border-border py-2 text-center text-[11px]">
                    {Math.round(zoom * 100)}%
                </div>
            </div>
        </div>
    );
}
