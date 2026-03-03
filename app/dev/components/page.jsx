"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { H1, H2, Muted } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { Field, Label, HelperText, ErrorText } from "@/components/ui/Form";
import { Tabs } from "@/components/ui/Tabs";
import { FaTerminal, FaPalette, FaCube, FaCheckCircle } from "react-icons/fa";

export default function ComponentsDemoPage() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const [tab, setTab] = useState("atoms");

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-text space-y-20">
      <header className="border-b border-border pb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center">
            <FaTerminal />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
            Design System V2.0
          </span>
        </div>
        <H1 className="text-6xl font-black uppercase italic tracking-tighter decoration-brand-500 underline decoration-8 underline-offset-8">
          Intelligence Hub Lab
        </H1>
        <Muted className="text-xl font-bold uppercase tracking-tight italic mt-6 italic">
          Component inventory and specification tests.
        </Muted>
      </header>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 border-none shadow-2xl bg-surface">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-brand-500">
              Control Unit
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-muted leading-relaxed">
              Test global system states and interaction responses across the
              entire visual framework.
            </p>
            <div className="mt-8 space-y-4">
              <Button
                className="w-full font-black uppercase tracking-widest py-4 shadow-xl shadow-emerald-500/20 bg-emerald-500 border-none"
                onClick={() =>
                  showToast({
                    title: "SYSTEM STABLE",
                    description: "Communication channels green.",
                    variant: "success",
                  })
                }
              >
                Trigger Success
              </Button>
              <Button
                variant="outline"
                className="w-full font-black uppercase tracking-widest py-4 text-rose-500 border-rose-500/50"
                onClick={() =>
                  showToast({
                    title: "BREACH DETECTED",
                    description: "Validation failed in sector 7.",
                    variant: "danger",
                  })
                }
              >
                Trigger Danger
              </Button>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-2xl bg-surface">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-brand-500">
              Metadata Pins
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="font-black uppercase tracking-widest bg-brand-500/10 text-brand-500 border-none">
                Analysis
              </Badge>
              <Badge className="font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none">
                Verified
              </Badge>
              <Badge className="font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border-none">
                Urgent
              </Badge>
              <Badge className="font-black uppercase tracking-widest bg-purple-500/10 text-purple-500 border-none">
                Premium
              </Badge>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <FaPalette className="text-brand-500" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Action Primitives
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                size="lg"
                className="font-black uppercase tracking-widest italic decoration-white hover:underline underline-offset-4 decoration-4"
              >
                Primary Command
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-black uppercase tracking-widest italic border-2 border-brand-500/50"
              >
                Secondary Protocol
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="font-black uppercase tracking-widest text-brand-500 italic"
              >
                Ghost Operation
              </Button>
              <Button
                size="lg"
                disabled
                className="font-black uppercase tracking-widest italic"
              >
                Offline Node
              </Button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <FaCube className="text-brand-500" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Data Intake
              </h2>
            </div>
            <div className="p-10 border border-border/50 rounded-[40px] bg-surface space-y-8">
              <Field>
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
                  Username Hash
                </Label>
                <Input
                  placeholder="AGENT_NAME"
                  className="bg-background border-none py-6 px-6 font-mono text-xs shadow-inner"
                />
                <HelperText className="text-[9px] font-bold uppercase tracking-widest text-muted">
                  Input your encrypted identification code.
                </HelperText>
              </Field>

              <Field>
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
                  Sector Authorization
                </Label>
                <Select className="bg-background border-none py-6 px-6 font-black uppercase italic tracking-tighter text-xs shadow-inner">
                  <option>Level 01: Core Hub</option>
                  <option>Level 02: Research Lab</option>
                  <option>Level 03: Executive Suite</option>
                </Select>
                <ErrorText className="text-[9px] font-bold uppercase tracking-widest text-rose-500 italic">
                  Unauthorized access level.
                </ErrorText>
              </Field>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
